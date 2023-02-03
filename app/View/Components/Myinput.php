<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Myinput extends Component
{
    public string $field;
    public string $cssid;
    public string $errorfield;
    public string $label;
    public string $type;
    public string $placeholder;
    public string $defval;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(string $field, string $label, string $type, string $defval, string $placeholder)
    {
        $this->field = $field;
        $this->cssid = \App\U\U::safeArrayname($field, "_");
        $this->errorfield = \App\U\U::safeArrayname($field, ".");
        $this->label = $label;
        $this->type = $type;
        $this->placeholder = $placeholder;
        $this->defval = $defval;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return <<<'blade'
    <fieldset id="field-{{ $field }}" class="field">
        <label class="label">{{ $label }}</label>
        <p class="control">
            <input name="{{ $field }}" id="{{ $cssid }}" class="val input @error($errorfield) is-danger @enderror" type="{{ $type }}" value="{{ $defval }}" placeholder="{{ $placeholder }}">
            @error($errorfield)
                <legend class="help is-danger">{{ join(" ", $errors->get($errorfield)) }}</legend>
            @enderror
        </p>
    </fieldset>
blade;
    }
}
