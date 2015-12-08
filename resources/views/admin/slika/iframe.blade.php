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
                font-size: 18px;
                font-family: arial;
                text-align: center;
                margin: -20px 0 10px;
            }

            input {
                font-size: 20px;
                text-align: center;
                margin: 20px 10px;
                border: 1px solid #B9B9B9;
                padding: 5px;
                color: #3A3A3A;
            }
            input.error {
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

            .userData{
                text-align: center;
                background: #D6D6D6;
                padding: 10px;
                color: #676767;
                border-bottom: 2px solid #676767;
            }
        </style>

        <script src="{{ url('assets/admin/js/jquery-2.1.1.min.js') }}"></script>

    </head>
    <body>
    <div class="container">
        <div class="userData">
            <div>
                {{ $name }} {{ $name ? ':' : '' }} {{ $userid }}
            </div>
        </div>
        <iframe src="https://direct.tranzila.com/jiniclub/iframe.php?transaction_id={{ $transaction_id }}&currency=1&trBgColor=dddddd&nologo=1&trTextColor=676767&lang=il&trButtonColor=676767&sum={{ $sum }}&tranmode=AK&myid={{ $identity }}"></iframe>
    </div>
    </body>
</html>