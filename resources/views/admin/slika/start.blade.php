<DOCTYPE html />
<html>
    <head>
        <title>דף סליקה ג'יני</title>
        <style>
            body{
                background: #ddd;
                direction: rtl;
                text-align: right;
            }
            .container
            {
                margin: 30px auto 0;
                max-width: 500px;
                display: block;
            }
            iframe{
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
            select {
                width: 256px;
            }

            input, select {
                font-size: 20px;
                text-align: center;
                margin: 20px 10px;
                border: 1px solid #B9B9B9;
                padding: 5px;
                color: #3A3A3A;
            }
            .error {
                border-color: #FF7F7F;
                color: #FF7F7F;
            }

            button {
                font-size: 20px;
                color: #3A3A3A;
                margin: 20px auto;
                display: block;
            }

            form{
                text-align: center;
            }
        </style>

        <script src="{{ url('assets/admin/js/jquery-2.1.1.min.js') }}"></script>
        <script>
            $(document).ready(function(){
                $('#form').submit(function(){
                    var error = true;
                    var userid      = $('#userid');
                    var name        = $('#name');
                    var cause       = $('#cause');
                    var identity    = $('#identity');
                    var sum         = $('#sum');

                    if(!userid.val())
                    {
                        userid.addClass('error');
                        error = false;
                    }
                    else
                    {
                        userid.removeClass('error');    
                    }
                    
                    if(!name.val())
                    {
                        name.addClass('error');
                        error = false;
                    }
                    else
                    {
                        name.removeClass('error');
                    }
                    
                    if(!Number(cause.val()))
                    {
                        cause.addClass('error');
                        error = false;
                    }
                    else
                    {
                        cause.removeClass('error');
                    }
                    
                    if(!identity.val())
                    {
                        identity.addClass('error');
                        error = false;
                    }
                    else
                    {
                        identity.removeClass('error');
                    }
                    
                    if(!sum.val())
                    {
                        sum.addClass('error');
                        error = false;
                    }
                    else
                    {
                        sum.removeClass('error');    
                    }

                    if(!error)
                    {
                        alert('ישנם שגיאות בטופס, תקן אותם על מנת להמשיך.')
                        return false;
                    }
                    
                })
            });
        </script>
    </head>
    <body>
    <div class="container">
        <form id="form" method="POST" action="{{url('admin/slika/getIframe')}}">
            <input type="text" name="userid" {!! $userid ? 'value="' . $userid . '"' : '' !!} id="userid"  placeholder="מזהה משתמש"/>
            <input type="text" name="name" {!! $name ? 'value="' . $name . '"' : '' !!} id="name"  placeholder="שם"/>
            <select id="cause" name="cause" placeholder="סיבת תשלום">
                <option {{ $cause == '1' ? 'selected' : '' }} value="1">מנוי חודשי</option>
                <option {{ $cause == '2' ? 'selected' : '' }} value="2">תשלום חד פעמי</option>
            </select>
            <input type="text" name="identity" {!! $identity ? 'value="' . $identity . '"' : '' !!} id="identity"  placeholder="תעודת זהות"/>
            <input type="text" name="sum" {!! $sum ? 'value="' . $sum . '"' : '' !!} id="sum"  placeholder="סכום לחיוב"/>

            <button type="submit" id="btn">צור טופס תשלום</button>
        </form>
    </div>
    </body>
</html>