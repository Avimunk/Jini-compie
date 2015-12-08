<DOCTYPE html/>
<html>
<head>
    <title>כרטיסים עבור משתמש: {{ $userid }}</title>
    <style>
        body {
            background: #ddd;
            text-align: right;
        }

        .container {
            margin: 30px auto 0;
            max-width: 1000px;
            display: block;
        }

        iframe {
            width: 500px;
            height: 500px;
            border: none;
            background: #ECECEC;
        }

        .container > div {
            color: #676767;
            direction: rtl;
            font-size: 30px;
            font-family: arial;
            text-align: center;
            margin: -20px 0 10px;
        }

        form input, form select{
            font-size: 20px;
            text-align: center;
            margin: 20px 10px;
            border: 1px solid #B9B9B9;
            padding: 5px;
            color: #3A3A3A;
        }
        form select {
            padding: 4px !important;
        }

        .error {
            border-color: #FF7F7F;
            color: #FF7F7F;
        }

        form button {
            font-size: 20px;
            color: #3A3A3A;
            margin: 20px auto;
        }

        form {
            text-align: center;
        }

        table {
            border: 3px solid #4C4C4C;
            border-spacing: 0;
            width: 100%;
            text-align: center;
        }

        td, th {
            padding: 10px 20px;
            border: 1px solid #4C4C4C;
        }

        #loader {
            display: none;
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 999;
            top: 0;
            left: 0;
        }

        .innerSpinner {
            width: 40px;
            height: 40px;
            position: absolute;
            margin: -20px 0 0 -20px;
            z-index: 999;
            top: 50%;
            left: 50%;
        }

        .double-bounce1, .double-bounce2 {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #FFF;
            opacity: 0.6;
            position: absolute;
            top: 0;
            left: 0;

            -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
            animation: sk-bounce 2.0s infinite ease-in-out;
        }

        .innerSpinner .double-bounce1, .innerSpinner .double-bounce2 {
            background-color: #333;
        }

        .double-bounce2 {
            -webkit-animation-delay: -1.0s !important;
            animation-delay: -1.0s !important;;
        }

        @-webkit-keyframes sk-bounce {
            0%, 100% { -webkit-transform: scale(0.0) }
            50% { -webkit-transform: scale(1.0) }
        }

        @keyframes sk-bounce {
            0%, 100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
            } 50% {
                  transform: scale(1.0);
                  -webkit-transform: scale(1.0);
              }
        }

        .double-bounce1, .double-bounce2 {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #FFF;
            opacity: .6;
            position: absolute;
            top: 0;
            left: 0;
            -webkit-animation: sk-bounce 2s infinite ease-in-out;
            animation: sk-bounce 2s infinite ease-in-out
        }

        .toggle{
            font-size: 14px;
            font-weight: bold;
            font-family: arial;
        }

        .toggle span{
            cursor: pointer;

        }
    </style>

    <script src="{{ url('assets/admin/js/jquery-2.1.1.min.js') }}"></script>
    <script>
        $(document).ready(function () {
            $loader = $('#loader');
            $('#form').submit(function () {
                var error  = true;
                var sum    = $('#sum');
                var sumVal = Number(sum.val());
                var cause  = $('#cause');
                var causeVal  = Number(cause.val());

                if (!sumVal) {
                    sum.addClass('error');
                    error = false;
                }
                else {
                    sum.removeClass('error');
                }

                if(!causeVal)
                {
                    cause.addClass('error');
                    error = false;
                }
                else
                {
                    cause.removeClass('error');
                }

                if (!error) {
                    alert('ישנם שגיאות בטופס, תקן אותם על מנת להמשיך.')
                    return false;
                }

            });

            $('.payByCardBTN').click(function() {
                var rowID = $(this).data('id');
                var price = $('#price_' + rowID);
                var priceVal = Number(price.val());

                console.log(price, rowID);
                if (!priceVal) {
                    price.addClass('error');
                    return false;
                }
                else {
                    price.removeClass('error');
                }

                if(confirm('בטוח? פעולה זו תחייב את הלקוח ב ' + priceVal + ' ש"ח'))
                {
                    $loader.show();
                    $.post('{{ url('admin/slika/initTokenPayment') }}/' + rowID + '/' + priceVal, {userID: '{{ $userid }}'}).then(function (resp) {

                        if(resp.type == 'err')
                        {
                            console.log('error!');
                            alert(resp.data);
                        }
                        else
                        {
                            console.log('success!');
                            alert(resp.data);
                        }

                        $loader.hide();
                        top.location = '{{ url('admin/slika/showUserCards/' . $userid) }}?openPayment=' + rowID;
//                        top.location.reload();
                    },function(){
                        alert('קרתה שגיאה לא צפויה, נסה שנית!');
                        $loader.hide();
                    });
                }
            });
            $('.show').click(function(){
                $(this).hide();
                $(this).next().show();
                $(this).parent().next().show();
            })
            $('.hide').click(function(){
                $(this).hide();
                $(this).prev().show();
                $(this).parent().next().hide();
            })
        });
    </script>
</head>
<body>
<div class="container">
    <div>
        User ID: {{ $userid }}
    </div>

    <table>
        <thead>
        <tr>
            <th>#</th>
            <th>Card</th>
            <th>Expired</th>
            <th>Created</th>
            <th>Price</th>
            <th>Pay</th>
            <th>Payments</th>
        </tr>
        </thead>
        <tbody>
        @foreach($userRows as $item)
            <tr>
                <td>{{ $item->id }}</td>
                <td>****{{ $item->four_digits }}</td>
                <td>{{ $item->credit_expired }}</td>
                <td>{{ date('h:i d/m/Y', strtotime($item->created_at)) }}</td>
                <td><input type="text" name="price_{{ $item->id }}" placeholder="Price" id="price_{{ $item->id }}"></td>
                <td>
                    <button data-id="{{ $item->id }}" class="payByCardBTN">בצע תשלום מכרטיס זה</button>
                </td>
                <td>

                    @if($item->children->count())
                        <div class="toggle">
                            <span {!! $item->id == $openPayment ? 'style="display: none"' : '' !!} class="show">+</span>
                            <span {!! $item->id != $openPayment ? 'style="display: none"' : '' !!} class="hide">-</span>
                        </div>
                        <table  {!! $item->id != $openPayment ? 'style="display: none"' : '' !!}>
                            <thead>
                                <th>#</th>
                                <th>Date</th>
                                <th>Sum</th>
                            </thead>
                            <tbody>
                                @foreach($item->children as $subItem)
                                    <tr>
                                        <td>{{ $subItem->id }}</td>
                                        <td style="width: 250px;">{{ date('h:i d/m/Y', strtotime($subItem->created_at)) }}</td>
                                        <td>{{ $subItem->sum }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @else
                        לא בוצעו תשלומים נוספים
                    @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <form id="form" method="POST" action="{{ url('admin/slika/getIframe') }}">
        <input type="hidden" name="isNew" value="1"/>
        <input type="hidden" name="userid" value="{{ $userid }}" id="userid" placeholder="מזהה משתמש"/>
        <input type="hidden" name="name" value="{{ $item->name }}" id="name" placeholder="שם"/>
        <input type="hidden" name="identity" value="{{ $item->identity }}" id="identity" placeholder="תעודת זהות"/>

        <select id="cause" name="cause" placeholder="סיבת תשלום">
            <option {{ $item->cause == '1' ? 'selected' : '' }} value="1">מנוי חודשי</option>
            <option {{ $item->cause == '2' ? 'selected' : '' }} value="2">תשלום חד פעמי</option>
        </select>
        <input type="text" name="sum" id="sum" placeholder="סכום לחיוב"/>
        <button type="submit" id="btn">שלם בכרטיס חדש</button>
    </form>
</div>
<div id="loader">
    <div class="innerSpinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    </div>
</div>
</body>
</html>