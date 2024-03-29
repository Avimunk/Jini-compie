<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@section('title') Laravel 5 Sample Site @show</title>
    @section('meta_keywords')
        <meta name="keywords" content="your, awesome, keywords, here"/>
    @show @section('meta_author')
        <meta name="author" content="Jon Doe"/>
    @show @section('meta_description')
        <meta name="description"
              content="Lorem ipsum dolor sit amet, nihil fabulas et sea, nam posse menandri scripserit no, mei."/>
    @show

		<link href="{{ url(elixir('css/site.css')) }}" rel="stylesheet">
		{{--<link href="{{ elixir('css/site.css') }}" rel="stylesheet">--}}

    {{-- TODO: Incorporate into elixer workflow. --}}
    {{--<link rel="stylesheet"--}}
          {{--href="{{asset('assets/site/css/half-slider.css')}}">--}}
    {{--<link rel="stylesheet"--}}
          {{--href="{{asset('assets/site/css/justifiedGallery.min.css')}}"/>--}}
    {{--<link rel="stylesheet"--}}
          {{--href="{{asset('assets/site/css/lightbox.min.css')}}"/>--}}

    @yield('styles')

    <script>
        var siteUrl = '{{ url() }}';
    </script>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="{{ url('/js/libs/detectizr.js') }}"></script>

    @yield('scripts')

    <script src="{{ url('/js/typeahead.bundle.js') }}"></script>

    <script type="text/javascript" src="{{ url('/js/libs/jquery.slimscroll.min.js') }}"></script>

    <script src="{{ url('/js/catalog.js') }}"></script>

    <!-- Fonts -->
<!--    <link href='//fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'>-->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places&language=fr"></script>


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="{{ url('https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js') }}"></script>
    <script src="{{ url('https://oss.maxcdn.com/respond/1.4.2/respond.min.js') }}"></script>
    <![endif]-->

    <link rel="shortcut icon" href="{{ asset('assets/site/ico/favicon.ico') }}">

<!--    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Varela+Round|Comfortaa:400,700,300">-->
    <link rel="stylesheet" href="css/styles.css">


    <style>
        .map-canvas {
            width: 100%;
            height: 500px;
            margin: 0;
            padding: 0;
        }

        .controls {
            margin-top: 16px;
            border: 1px solid transparent;
            border-radius: 2px 0 0 2px;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            height: 32px;
            outline: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .pac-input {
            background-color: #fff;
            font-family: Roboto;
            font-size: 15px;
            font-weight: 300;
            margin-left: 12px;
            padding: 0 11px 0 13px;
            text-overflow: ellipsis;
            width: 400px;
        }

        .pac-input:focus {
            border-color: #4d90fe;
        }

        .pac-container {
            width: 100%;
            height: 500px;

            font-family: Roboto;
        }

        #type-selector {
            color: #fff;
            background-color: #4d90fe;
            padding: 5px 11px 0px 11px;
        }

        #type-selector label {
            font-family: Roboto;
            font-size: 13px;
            font-weight: 300;
        }








        #footer {
            display: none;
        }








    </style>





    {{-- TODO: Incorporate into elixir workflow. --}}
    {{--<script src="{{asset('assets/site/js/jquery.justifiedGallery.min.js')}}"></script>--}}
    {{--<script src="{{asset('assets/site/js/lightbox.min.js')}}"></script>--}}

    <script>
        $('#flash-overlay-modal').modal();
        $('div.alert').not('.alert-danger').delay(3000).slideUp(300);
    </script>



</head>
<body>
    <header>
        @include('partials.nav')
    </header>
    @include('flash::message')
    @yield('content')
    @include('partials.footer')
</body>
</html>
