<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Mycheckbox extends Component
{
    public string $field;
    public string $cssid;
    public string $errorfield;
    public string $label;
    public string $defval;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(string $field, string $label, string $defval)
    {
        $this->field = $field;
        $this->cssid = \App\U\U::safeArrayname($field, "_");
        $this->errorfield = \App\U\U::safeArrayname($field, ".");
        $this->label = $label;
        $this->defval = $defval ? " checked " : "";
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
        <label class="checkbox">
            <input name="{{ $field }}" id="{{ $cssid }}" class="val @error($errorfield) is-danger @enderror" type="checkbox" {{ $defval }}>
            {{ $label }}
            @error($errorfield)
                <legend class="help is-danger">{{ join(" ", $errors->get($errorfield)) }}</legend>
            @enderror
        </label>
    </fieldset>
blade;
    }
}
