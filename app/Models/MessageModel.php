<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kyslik\ColumnSortable\Sortable;

class MessageModel extends Model
{
    protected $table = 'messages';
    public $timestamps = false;
    use Sortable;
    protected $fillable = ['username', 'email', 'text'];
    public array $sortable = [ 'username', 'email', 'datetime' ];
}
