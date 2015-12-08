<?php namespace App\Http\Controllers\Admin;

use App\Slika;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;
use Symfony\Component\HttpFoundation\Tests\NewRequest;

class SlikaController extends AdminController {

    public function index(Request $request)
    {
        $userid     = $request->get('userid');
        $name       = $request->get('name');
        $cause      = $request->get('cause');
        $identity   = $request->get('identity');
        $sum        = $request->get('sum');

        // Show the page
        return view('admin.slika.start', compact('userid', 'name', 'cause', 'identity', 'sum'));
    }

    public function getIframe(Request $request)
    {
        $isNew = $request->get('isNew', false);

        $userid     = $request->get('userid');
        $name       = $request->get('name');
        $cause       = $request->get('cause');
        $identity   = $request->get('identity');
        $sum        = $request->get('sum');

        // check for user creditCatds
        if(!$isNew)
        {
            $userRows = Slika::where('userID', '=', $userid)->where('token', '!=', '')->where('response_number', '=', '000')->count();
            if($userRows > 0)
            {
                return redirect(url('admin/slika/showUserCards/' . $userid));
            }
        }

        $transaction_id = $request->get('transaction_id', false);

        if($transaction_id && $row = Slika::where('transaction_id', '=', $transaction_id)->where('response_number', '=', '')->first())
        {
            $sum = $row['sum'];
            $identity = $row['identity'];
            $name = $row['name'];
            $cause = $row['cause'];
            $userid = $row['userid'];
        }
//        elseif($userid && $row = Slika::where('userID', '=', $userid)->where('response_number', '=', '')->first())
//        {
//            $row->update([
//                'sum'       => $sum,
//                'identity'  => $identity,
//                'name'      => $name,
//                'cause'      => $cause,
//            ]);
//        }
        else
        {
            Slika::where('userID', '=', $userid)->where('response_number', '=', '')->delete();
            $transaction_id = rand(1111111, 9999999) . time();
            $row = Slika::create([
                'transaction_id'=> $transaction_id,
                'userID'        => $userid,
                'name'          => $name,
                'cause'         => $cause,
                'identity'      => $identity,
                'sum'           => $sum,
            ]);
        }

        // Show the page
        return view('admin.slika.iframe', compact('transaction_id', 'userid', 'name', 'cause', 'sum', 'identity'));
    }

    public function notify(Request $request)
    {
        $json = json_encode(array(
            "POST"   =>  $_POST,
            "GET"    =>  $_GET,
        ));
        mail('nk@leado.co.il', 'Jini slika error', $json);
        $Response = $request->get('Response', false);
        $transaction_id = $request->get('transaction_id', false);
        if($Response && $transaction_id)
        {
            $slikaRow = Slika::where('transaction_id', '=', $transaction_id)->where('response_number', '=', '');
            if($slikaRow)
            {
                $four_digits = $request->get('ccno', '0000');
                $credit_expired = $request->get('expmonth', '00') . '/' . $request->get('expyear', '00');
                $approve_number = $request->get('Tempref', '');
                $token = $request->get('TranzilaTK', '');
                $sum = $request->get('sum', 0);
                if($sum == $slikaRow['sum'])
                {
                    $slikaRow->update([
                        'data'              => $json,
                        'response_number'   => $Response,
                        'four_digits'       => $four_digits,
                        'credit_expired'    => $credit_expired,
                        'approve_number'    => $approve_number,
                        'token'             => $token,
                    ]);

                }
                else
                {
                    mail('nk@leado.co.il', 'Jini slika error', 'sum not right: '. $json);
                }
            }
        }
    }

    public function showUserCards($id, Request $request)
    {
        $userid = $id;
        $userRows = Slika::where('userid', '=', $userid)->where('token', '!=', '')->where('response_number', '=', '000');

        if($userRows->count() == 0)
        {
            return redirect(url('admin/slika/start'));
        }

        $userRows = $userRows->get();

        $openPayment = $request->get('openPayment', false);

        // Show the page
        return view('admin.slika.cards', compact('userRows', 'userid', 'openPayment'));
    }

    public function initTokenPayment(Request $request, $id, $id2)
    {
        if(!$sum = $id2)
        {
            return [
                'type' => 'err',
                'data' => 'שגיאה, לא נשלח סכום לחיוב.',
            ];
        }

        $userid = $request->get('userID', false);
        $slikaRow = Slika::find($id);
        if(!$slikaRow->count() || $slikaRow->userID != $userid || !$userid)
        {
            return [
                'type' => 'err',
                'data' => 'כרטיס לא נמצא, נסה שנית או פנה למנהל המערכת.',
            ];
        }

        if($slikaRow->response_number != '000' || $slikaRow->token == '' || $slikaRow->transaction_id == '')
        {
            return [
                'type' => 'err',
                'data' => 'שגיאה, פעולה זו לא ניתנת לביצוע עבור כרטיס זה.',
            ];
        }

        list($expiredM, $expiredY) = explode('/', $slikaRow);
        if($expiredY <= date('y') && $expiredM < date('m')){
            return [
                'type' => 'err',
                'data' => 'תוקף הכרטיס פג, אין אפשרות לחייב יותר בכרטיס זה.',
            ];
        }


        $params = [
            'supplier'  =>  'jiniclub',
            'sum'       =>  $sum,
            'expdate'   =>  $expiredM.$expiredY,
            'currency'  =>  1,
            'tranzilaTW'=>  'tII97U',
            'tranzilaTK'=>  $slikaRow->token,
        ];

        $host = 'secure5.tranzila.com';         // gateway host
        $path = '/cgi-bin/tranzila31tk.cgi';    // gateway uri
        $formdata = array();
        $formdata['supplier'] = 'jiniclub';        // supplier

        $formdata['sum']        = $sum;
        $formdata['expdate']    = $expiredM.$expiredY;

        $formdata['TranzilaPW'] = 'tII97U';
        $formdata['currency']   = 1;
        $formdata['TranzilaTK'] = $slikaRow->token;
        $formdata['myid']       = $slikaRow->identity;
        $formdata['userid']     = $slikaRow->userID;

        $formdata['transaction_id'] = $slikaRow->transaction_id;
        $formdata['isTokenPayment'] = 1;

        $poststring = '';
        // formatting the request string
        foreach($formdata AS $key => $val)
        {
            //echo $key .': '.$val."\n\r";
            $poststring .= $key . "=" . $val . "&";
        }

        // strip off trailing ampersand
        $poststring = substr($poststring, 0, -1);

        // init curl connection
        $CR = curl_init();
        curl_setopt($CR, CURLOPT_URL, "https://".$host.$path);
        curl_setopt($CR, CURLOPT_POST, 1);
        curl_setopt($CR, CURLOPT_FAILONERROR, true);
        curl_setopt($CR, CURLOPT_POSTFIELDS, $poststring);
        curl_setopt($CR, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($CR, CURLOPT_SSL_VERIFYPEER, 0);
        // actual curl execution perfom
        $result = curl_exec( $CR );
        $error = curl_error( $CR );
        // on error - exit with error message

        curl_close( $CR );

        // re-format the string into array
        parse_str($result, $post);
        $_POST = $post;

        $slikaRow->children()->create([
            'approve_number'    =>  $slikaRow->approve_number,
            'data'              =>  json_encode([$result]),
            'sum'               =>  $sum,
        ]);

        return [
            'type' => 'suc',
            'data' => 'הפעולה עברה בהצלחה!',
        ];
    }

}
