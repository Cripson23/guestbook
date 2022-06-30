@extends('layout')

@section('title')Guest book @endsection

@section('content')
    <div class="messages__content">
        <div class="messages__header">
            <h2>Messages</h2>
        </div>
        <table class="table" id="messages__table">
            <thead>
                <tr>
                    <th>@sortablelink('username')</th>
                    <th>@sortablelink('email')</th>
                    <th>Text</th>
                    <th>@sortablelink('datetime')</th>
                </tr>
            </thead>
            <tbody>
                @foreach($messages as $key=>$mes)
                    <tr>
                        <td class="message__uname">{{ $mes->username }}</td>
                        <td class="message__email">{{ $mes->email }}</td>
                        <td class="message__text">{{ $mes->text }}</td>
                        <td class="message__datetime">{{ $mes->datetime }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        {!! $messages->links() !!}
    </div>
    <button id="btn-message">Send message</button>
    <!-- The Modal -->
    <div id="addMessageModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="btn-close">&times;</span>
                <h2>Sending a message</h2>
            </div>
            <div class="modal-body">
                @if($errors->any())
                    <div class="alert-errors">
                        <ul>
                            @foreach($errors->all() as $error)
                                <li>
                                    {{ $error }}
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form id="sendMessageForm" method="post" action="/send-form">
                    @csrf
                    <label for="uname">User Name</label>
                    <input type="text" id="uname" name="uname">
                    <div class="validation-errors"></div>
                    <div class="form-row">
                        <label for="email">E-mail</label>
                        <input type="text" id="email" name="email">
                        <div class="validation-errors"></div>
                    </div>
                    <div class="form-row">
                        <label for="text-message">Text</label>
                        <textarea id="text-message" name="text-message"></textarea>
                        <div class="validation-errors"></div>
                    </div>
                    <div class="form-row">
                        <div class="captcha">
                            <div class="captcha__image-reload">
                                <img class="captcha__image" src="" width="160" alt="captcha">
                                <button type="button" class="captcha__refresh"></button>
                            </div>
                            <div class="captcha__group">
                                <label for="captcha">CAPTCHA code (6 symbols):</label>
                                <input type="text" id="captcha" name="captcha">
                                <div class="validation-errors"></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row-buttons">
                        <input id="btn-submit-message-form" type="button" value="Send">
                        <input id="btn-reset-message-form" type="reset" value="Cancel">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <h3>Thanks for the feedback!</h3>
            </div>
        </div>
    </div>
@endsection
