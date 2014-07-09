/*
**  Image Browser 1.0.0
**  Plugin for TinyMCE
**  https://github.com/hozakar/imagebrowser-for-tinymce
**
**  Copyright 2014, Hakan Özakar
**  http://beltslib.net
**
**  Licensed under CC0 1.0 Universal Licence:
**  https://creativecommons.org/publicdomain/zero/1.0/
*/

"use strict";

$(function () {
    var holding = 0;

    $('.images li').click(function (e) {
        e.stopPropagation();
    })
    $('.fileblock').click(function (e) {
        $('.images li').removeClass('selected');
        $('input[name=selfile]').val('');
    })

    $('.imgfile').dblclick(function () {
        if (holding) return;
        $(parent.document).find('.mce-okbtn button[role=presentation]').click();
    });

    $('.imgfile').click(function () {
        switch (holding) {
            case 0:
                $(this).parents('.images').find('li').removeClass('selected');
                $(this.parentNode).toggleClass('selected');
                break;
            case 17:
                $(this.parentNode).toggleClass('selected');
                break;
            default:
                var first = $(this).parents('.images').find('li.selected')[0];
                var last = this.parentNode;
                var firstInd, lastInd;
                if (!first) first = last;
                var li = $(this).parents('.images').find('li');
                $(li).removeClass('selected');
                for (var i = 0; i < li.length; i++) {
                    if (li[i] == first) firstInd = i;
                    if (li[i] == last) lastInd = i;
                }
                var b = Math.min(firstInd, lastInd);
                var e = Math.max(firstInd, lastInd);
                for (var i = b; i <= e; i++) $(li[i]).addClass('selected');
        }
        if ($(this.parentNode).hasClass('selected')) {
            $('input[name=selfile]').val($(this.parentNode).data('root') + $(this.parentNode).attr('title'));
        } else {
            var selli = $('.images li.selected').length ? $('.images li.selected')[0] : false;
            var sel = selli ? $(selli).data('root') + $(selli).attr('title') : '';
            $('input[name=selfile]').val(sel);
        }
    });

    $('body').keyup(function (e) {
        if (e.keyCode == 16 || e.keyCode == 17) {
            holding -= e.keyCode;
        }
        switch (e.keyCode) {
            case 46: //Del
                if (holding) return;
                if (!$('.images li.selected').length) return;
                del();
                break;
            case 88: //X
                if (holding != 17) return;
                cx();
                break;
            case 86: //V
                if (holding != 17) return;
                cv()
                break;
            case 67: //C
                if (holding != 17) return;
                cc();
                break;
            case 65: //A
                if (holding != 17) return;
                $('.images').find('li').addClass('selected');
                if (!$('input[name=selfile]').val()) {
                    var selli = $('.images li.selected').length ? $('.images li.selected')[0] : false;
                    var sel = selli ? $(selli).data('root') + $(selli).attr('title') : '';
                    $('input[name=selfile]').val(sel);
                }
                break;
        }

    });

    $('body').keydown(function (e) {
        if ((e.keyCode == 16 || e.keyCode == 17) && holding != e.keyCode && holding <= 17) {
            holding += e.keyCode;
        }
    });

    $('.delpic').click(function () { deletePic(this); });

    $('a.adddir').click(function () {
        var newdir = $(this).find('input[name=adddir]').val();
        if (newdir) {
            location.replace('?lang=' + $('input[name=lang]').val() + '&ow=' + $('input[name=ow]').val() + '&optype=newdir&root=' + $(this).data('root') + '&newdir=' + newdir);
        } else {
            $(this).find('input[name=adddir]').focus();
        }
    });

    $('a.adddir input[name=adddir]').keyup(function (e) {
        if (e.keyCode != 13) return;
        var newdir = $(this).val();
        if (newdir) location.replace('?lang=' + $('input[name=lang]').val() + '&ow=' + $('input[name=ow]').val() + '&optype=newdir&root=' + $(this).parents('a.adddir').data('root') + '&newdir=' + newdir);
    });

    $('a.deldir').click(function () {
        var deldir = $(this).data('dir');
        if (!deldir) return;
        if (confirm($('#conf_directory_delete').val())) {
            location.replace('?lang=' + $('input[name=lang]').val() + '&ow=' + $('input[name=ow]').val() + '&optype=deldir&root=' + $(this).data('root') + '&deldir=' + deldir);
        }
    });

    $('.btn-add').click(function () { $('.fileuploadbtn').click(); });
    $('.btn-del').click(del);
    $('.btn-cut').click(cx);
    $('.btn-copy').click(cc);
    $('.btn-paste').click(cv);

    $('.float-btn').click(function () {
        $('.float-btn').removeClass('selected');
        $(this).addClass('selected');
        $('input[name=float]').val($('.float-btn.selected').data('float'));
    });

    $('#selwidth').change(function () {
        if ($(this).val() == 1) {
            $('[name=width]')
                .removeClass('hidden')
                .val('')
                .focus();
        } else {
            $('[name=width]')
                .addClass('hidden')
                .val($(this).val());
        }
    })

    /* FileUpload Stuff */
    var url = 'fileupload/images/php/';
    var filelist = new Array();
    $('.fileuploadbtn').fileupload({
        url: url,
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $.ajax({
                    url: '?lang=' + $('input[name=lang]').val() + '&ow=' + $('input[name=ow]').val() + '&optype=movefile&root=' + $('.fileuploadbtn').data('root') + '&filename=' + file.name
                });
                filelist.push(file.name);
            });
        },
        stop: function () {
            var files = filelist.join(',');
            setTimeout(function () {
                location.replace('?lang=' + $('input[name=lang]').val() + '&ow=' + $('input[name=ow]').val() + '&root=' + $('.fileuploadbtn').data('root') + '&files=' + files);
            }, 250);
        },
        start: function () {
            $('.cover').fadeToggle(200);
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
    /* End: FileUpload Stuff */

});

function deletePic(el) {
    el = $(el).parents('li')[0];
    if (!confirm($('#conf_file_delete').val())) return;
    $('.images').find('li').removeClass('selected');
    $(el).addClass('selected');
    opset('delete');
}

function opset(type) {
    if (type == 'paste') {
        var data = $('#fileopform').serialize();
        data += '&paste=1';
        $.ajax({
            type: "POST",
            url: "fops.php",
            data: data
        }).done(function () {
            location.reload();
        });
    } else {
        $('[name=opdir]').val($('[name=root]').val());
        $('[name=optype]').val(type);
        var selfiles = $('.images li.selected');
        var filelist = new Array();
        for (var i = 0; i < selfiles.length; i++) {
            filelist.push($(selfiles[i]).attr('title'));
        }
        $('[name=files]').val(filelist.join(','));

        var data = $('#fileopform').serialize();

        if (type == 'delete') {
            $('#fileopform').submit();
        } else {
            $.ajax({
                type: "POST",
                url: "fops.php",
                data: data
            });
        }
    }
}

function del() {
    if (!confirm($('#conf_sel_file_delete').val())) return;
    opset('delete');
}
function cx() {
    if (!$('.images li.selected').length) return;
    var selfiles = $('.images li.selected');
    var files = $('.images li');
    files.removeClass('cut');
    selfiles.addClass('cut');
    opset('cut');
}
function cv() {
    opset('paste');
}
function cc() {
    if (!$('.images li.selected').length) return;
    var files = $('.images li');
    files.removeClass('cut');
    opset('copy');
}
