@extends('admin.layouts.default')

{{-- Web site Title --}}
@section('title') {{{ trans("admin/objecttype.objecttypes") }}}
:: @parent @stop

{{-- Content --}}
@section('main')
<!-- Tabs -->
<ul class="nav nav-tabs">
    <li class="active"><a href="#tab-general" data-toggle="tab"> {{
            trans("admin/modal.general") }}</a></li>
    @if(isset($object))
        <li>
            <a href="#tab-keywords" data-toggle="tab"> {{ trans("admin/admin.keywords") }}</a>
        </li>
    @endif
</ul>
<!-- ./ tabs -->
{{-- Edit Blog Form --}}
<form class="form-horizontal" id="fupload" enctype="multipart/form-data"
      method="post"
      action="@if(isset($object)){{ URL::to('admin/categories/'.$object->id.'/edit') }}
	        @else{{ URL::to('admin/categories/create') }}@endif"
      autocomplete="off">
    <!-- CSRF Token -->
    <input type="hidden" name="_token" value="{{{ csrf_token() }}}" />
    <!-- ./ csrf token -->
    <!-- Tabs Content -->
    <div class="tab-content">
        <!-- General tab -->
        <div class="tab-pane active" id="tab-general">
            <div class="col-md-8">
                <div
                    class="form-group {{{ $errors->has('name') ? 'has-error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="name"> {{
                            trans("admin/admin.name") }}</label> <input
                            class="form-control" type="text" name="name" id="name"
                            value="{{{ Input::old('name', isset($object) ? $object->name : null) }}}" />
                        {!!$errors->first('name', '<label class="control-label">:message</label>')!!}
                    </div>
                </div>
                <div
                    class="form-group {{{ $errors->has('title') ? 'has-error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="title"> {{
                            trans("admin/admin.title") }}</label> <input
                            class="form-control" type="text" name="title" id="title"
                            value="{{{ Input::old('title', isset($object) ? $object->title : null) }}}" />
                        {!!$errors->first('title', '<label class="control-label">:message</label>')!!}
                    </div>
                </div>
                <div class="form-group {{{ $errors->has('score') ? 'error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="field_type">{{
                        trans("admin/admin.score") }}</label>
                        <select
                                style="width: 100%" name="score" id="score"
                                class="form-control">
                            @for($i=0; $i<= 10; $i++)
                                <option {{{isset($object) && $object->score == $i ? 'selected' : ''}}} value="{{$i}}">{{$i ?: trans("admin/admin.no_score")}}</option>
                            @endfor
                        </select>
                    </div>
                </div>
                <div class="form-group {{{ $errors->has('url') ? 'error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="url">{{ trans("admin/admin.url") }}</label>
                        <input class="form-control" type="text" name="url" id="url" value="{{ isset($object) && $object->url ? $object->url : '' }}">
                    </div>
                    <div class="col-md-12">
                        <label class="control-label" for="target"> {{ trans("admin/admin.target") }}</label>
                        <input name="target" id="target" type="checkbox" value="1" {{ isset($object) && $object->target == '_blank' ? 'checked' : '' }}>

                    </div>
                </div>



                <div class="form-group {{{ $errors->has('parent_id') ? 'error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="parent_id">{{
                            trans("admin/admin.parent") }}</label>
                        <select
                            style="width: 100%" name="parent_id" id="parent_id"
                            class="form-control"> <option value="" text=""></option> @foreach($categories as $item)
                            <option value="{{$item->id}}"
                            @if(!empty($parent_id))
                            @if($item->id==$parent_id)
                            selected="selected" @endif @endif >{{$item->title}}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div
                    class="form-group {{{ $errors->has('tooltip') ? 'has-error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="tooltip"> {{
                            trans("admin/admin.tooltip") }}</label> <input
                            class="form-control" type="text" name="toolTip" id="toolTip"
                            value="{{{ Input::old('tooltip', isset($object) ? $toolTip : null) }}}" />
                        {!!$errors->first('tooltip', '<label class="control-label">:message</label>')!!}
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-12">
                        <label class="control-label" for="content">{{
                            trans("admin/admin.content") }}</label>
                        <textarea class="form-control full-width wysihtml5"
                                  name="content" rows="10">{{{ Input::old('content', isset($object) ? $object->content : null) }}}</textarea>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-12">
                        <label class="control-label" for="excerpt">{{
                            trans("admin/admin.excerpt") }}</label>
                        <textarea class="form-control full-width wysihtml5"
                                  name="excerpt" rows="10">{{{ Input::old('excerpt', isset($object) ? $object->excerpt : null) }}}</textarea>
                    </div>
                </div>
            </div>
                <!-- ./ general tab -->
            <div class="col-md-4">
                <div
                    class="form-group {{{ $errors->has('featuredImage') ? 'error' : '' }}}">
                    <div class="col-lg-12">
                        <label class="control-label" for="featuredImage">{{
                            trans("admin/admin.featured_image") }}</label>
                        @if (!empty($featuredImage))
                        <img style="max-width: 300px" src="{{ URL::to('/uploads/' . $featuredImage) }}" />
                        @endif
                        <input name="featuredImage" type="file" class="uploader" id="featuredImage" value="Upload" />
                    </div>

                </div>
                <div
                    class="form-group {{{ $errors->has('contentImage') ? 'error' : '' }}}">
                    <div class="col-lg-12">
                        <label class="control-label" for="contentImage">{{
                            trans("admin/admin.content_image") }}</label>
                        @if (!empty($contentImage))
                        <img style="max-width: 300px" src="{{ URL::to('/uploads/' . $contentImage) }}" />
                        @endif
                        <input name="contentImage" type="file" class="uploader" id="contentImage" value="Upload" />
                    </div>

                </div>
            </div>
        </div>
        @if(isset($object))
            <div class="tab-pane" id="tab-keywords">
                <div class="form-group {{{ $errors->has('keywords') ? 'has-error' : '' }}}">
                    <div class="col-md-12">
                        <label class="control-label" for="field_label"> {{ trans("admin/admin.keywords") }}</label>
                        <input class="form-control" type="text" name="keywords" id="keywords" value="{{{ Input::old('keywords', isset($object) && isset($keywords) ? $keywords : null) }}}" />
                        {!!$errors->first('label', '<span class="help-block">:message </span>')!!}
                    </div>
                </div>
            </div>
        @endif
        <!-- ./ tabs content -->

            <!-- Form Actions -->

            <div class="form-group">
                <div class="col-md-12">
                    <button type="reset" class="btn btn-sm btn-warning close_popup">
                        <span class="glyphicon glyphicon-ban-circle"></span> {{
                        trans("admin/modal.cancel") }}
                    </button>
                    <button type="reset" class="btn btn-sm btn-default">
                        <span class="glyphicon glyphicon-remove-circle"></span> {{
                        trans("admin/modal.reset") }}
                    </button>
                    <button type="submit" class="btn btn-sm btn-success">
                        <span class="glyphicon glyphicon-ok-circle"></span>
                        @if	(isset($object))
                        {{ trans("admin/modal.edit") }}
                        @else
                        {{trans("admin/modal.create") }}
                        @endif
                    </button>
                </div>
            </div>
            <!-- ./ form actions -->

</form>
@stop
