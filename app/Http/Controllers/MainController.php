<?php

namespace App\Http\Controllers;

use App\Models\MessageModel;
use Illuminate\Http\Request;

class MainController extends Controller
{
    public function main() {
        $messages = MessageModel::sortable('datetime')->paginate(5);
        return view('main', compact('messages'));
    }

    public function get_captcha(Request $request): \Illuminate\Http\JsonResponse
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
        $length = 6;
        $code = substr(str_shuffle($chars), 0, $length);
        $request->session()->put("captcha", crypt($code, '4DdR$31#$51@3'));
        $image = imagecreatefrompng(base_path() . '/public/img/captcha/bg.png');
        $color = imagecolorallocate($image, 112, 146, 255);

        $x = 25;
        $y = 10;

        imagestring($image, 5, $x, $y, substr($code, 0, 3), $color);
        imagestring($image, 5, $x+20, $y+20, substr($code, 3, 3), $color);

        $session_id = session()->getId();
        $img_path = 'img/captcha/' . $session_id . '.png';
        imagepng($image, $img_path);

        $data = [
            "img_path" => $img_path,
        ];
        return response()->json($data);
    }

    public function check_captcha(Request $request): \Illuminate\Http\JsonResponse
    {
        $captcha = $request->json("captcha");
        $code = crypt(trim($captcha), '4DdR$31#$51@3');
        $code_original = $request->session()->get("captcha");

        if (strlen($captcha) != 6)
            $result = false;
        else
            $result = hash_equals($code, $code_original);

        $data = [
            "result" => $result,
            "code" => $code,
            "captcha" => $captcha,
            "code_original" => $code_original
        ];

        return response()->json($data);
    }

    public function send_form(Request $request) {
        $request->validate([
            'uname' => 'required|min:3|max:40|regex:/^[a-zA-Z\d]+$/',
            'email' => ['required','min:5','max:100', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'],
            'text-message' => 'required|min:10|max:540',
            'captcha' => 'required|min:6|max:6',
        ]);

        $message = new MessageModel();
        $message->username = $request->input('uname');
        $message->email = $request->input('email');

        $text_message = $request->input('text-message');
        // Удаляем все html теги
        $text_message = preg_replace("/(\<(\/?[^>]+)>)/", '', $text_message);
        $text_message = preg_replace("/\s{2,}/", '', $text_message);

        $message->text = $text_message;

        date_default_timezone_set("Europe/Moscow");
        $message->datetime = date("Y-m-d H:i:s");

        $message->ip = $request->ip();
        $message->browser = $request->userAgent();

        $message->save();

        return redirect()->route('main');
    }
}
