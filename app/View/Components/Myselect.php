<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Myselect extends Component
{
    public $field;
    public $cssid;
    public $errorfield;
    public $label;
    public $options;
    public $defval;
    public $filter;
    public $haslabel;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($field, $label, $options, $defval, $enablefilter = false, $haslabel = true)
    {
        $this->field = $field;
        $this->cssid = \App\U\U::safeArrayname($field, "_");
        $this->errorfield = \App\U\U::safeArrayname($field, ".");
        $this->label = $label;
        $this->options = $options;
        $this->defval = $defval;
        $this->filter = $this->filter($enablefilter);
        $this->haslabel = $haslabel;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return <<< 'blade'
@if($haslabel)
<fieldset id="field-{{ $field }}" class="field">
    <label class="label">{{ $label }}</label>
    <p class="control">
@endif
        <div class="select is-fullwidth">
            <select name="{{ $field }}" id="{{ $cssid }}">
                @foreach ($options as $option)
                <option value="{{ $option['id'] }}" {{ $defval == $option['id'] ? "selected" : "" }} >{{ $option['name'] }}</option>
                @endforeach
            </select>
        </div>
        <div>{!! $filter !!}</div>
        @error($errorfield)
            <legend class="help is-danger">{{ join(" ", $errors->get($errorfield)) }}</legend>
        @enderror
@if($haslabel)
    </p>
</fieldset>
@endif
blade;
    }

    private function filter($enablefilter)
    {
        if(!$enablefilter) {
            return "";
        }
        return <<< EOM
        <div>
            <input type="text" id="{$this->field}-filter" placeholder="選択肢のフィルタ">
        </div>
        <script type="text/javascript">
        let options_{$this->field};
        window.addEventListener("load", function() {
            const filter = document.querySelector("#{$this->field}-filter");
            const select = document.querySelector("#{$this->field}");

            // optionsを退避
            options_{$this->field} = document.querySelectorAll("#{$this->field} option");

            // 本体処理
            filter.addEventListener("change", function() {
                // 処理中はselectを無効化
                select.setAttribute("disabled", true);

                // 一旦、現在のoptionを削除
                document.querySelectorAll("#{$this->field} option").forEach(function(node) {
                    select.removeChild(node);
                });
                const str_filter = filter.value;
                // filterに合致するoptionのみ追加
                options_{$this->field}.forEach(function(node) {
                    if(node.text.indexOf(str_filter) >= 0) {
                        select.append(node);
                    }
                });
                // 処理完了
                select.removeAttribute("disabled");
            });
        });
        </script>
EOM;
    }
}
