<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Mydelbutton extends Component
{
    public string $url;
    public string $id;
    public string $label;
    public string $cssid;
    public string $csscls;
    public string $postdata;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(string $url, string $id, string $label = null, string $cssid = null, string $csscls = null, array $postdata = [])
    {
        $this->url = $url;
        $this->id = $id;
        $this->label = $label ? $label : "削除";
        $this->cssid = $cssid ? $cssid : "act-del-{$id}";
        $this->csscls = $csscls ? $csscls : " button " ;
        $this->postdata = "";
        foreach($postdata as $name => $data) {
            $this->postdata .= "<input type='hidden' name='{$name}' value='{$data}'>" . PHP_EOL;
        }
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return <<<'blade'
    <form id="delform-{{ $id }}" method="POST" action="{{ $url }}" enctype="multipart/form-data" class="d-inline-block">
        @csrf
        <input type="hidden" name="id" value="{{ $id }}"></input>
        {!! $postdata !!}
        <button id="{{ $cssid }}" class="{{ $csscls }} is-small act-del" data-delform-cssid="#delform-{{ $id }}" type="button">{{ $label }}</button>
    </form>
blade;
    }
}
