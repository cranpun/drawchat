<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @include("element/head")
        <title>{{ config("app.name") }}</title>

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }

            .full-height {
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body style="background: #f6f6f6;">
        <div class="flex-center position-ref full-height">
            @if (Route::has('login'))
                <div class="top-right links">
                    @auth
                        <a href="{{ url('/home') }}">Home</a>
                    @else
                        <a href="{{ route('login') }}">Login</a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}">Register</a>
                        @endif
                    @endauth
                </div>
            @endif

            <div class="content" style="padding: 1em;">
                <div class="title m-b-md">
                    <img alt="drawchat" src="{{ \App\U\U::filetimelink(asset('img/logo.png'), public_path() .'/img/logo.png') }}">
                </div>
                <div style="text-align: center"><string><a href="/paper">new paper</a></strong></div>
                <ul class="links" style="text-align: center; list-style-type: none; margin: 30px 0; overflow-y: scroll; height: 30vh;">
                    @foreach ($papers as $paper)
                        <li>
				<a href="/paper/{{ $paper->id }}">
					<span>Paper : {{ (\Carbon\Carbon::parse($paper->created_at))->format("Y-m-d H:i") }} </span>
					<span style="display: inline-block; width: 90px; text-align: right;">({{ sprintf("%10s", number_format($paper["len"])) }})</span>
				</a>
			</li>
                    @endforeach
                </ul>
            </div>
        </div>
    </body>
</html>
