Image Browser For TinyMCE
=========================


### Image Browser ###
>v.1.0.0

###Features:
* Create, delete, organize directories
* Upload, move, copy image files
* Supports JP(E)G, PNG, GIF file types

### Usage
First copy "imagebrowser" directory to TinyMCE plugins folder.

While initializing TinyMCE:

```html
<script>
	tinymce.init({
        ...
		plugins: "imagebrowser",
		toolbar: "imagebrowser",
        imagebrowser: {
            windowcaption: "",
			root: "/",
            overwrite: false
        }
        ...
	});
</script>
```

### Parameters
* ####windowcaption#### Defines dialog caption. (Default: Image Browser)
* ####root#### Defines a root directory for Image Browser. (Default: '/')
* ####overwrite#### What to do if the file already exists while pasting (NOT while uploading). (Default: 'true')


### Screenshot
![Flat Button Pack](http://beltslib.net/themes/images/screen.jpg)

### Languages
Supports English and Turkish

### Credits
* [jQuery File Upload By blueimp](https://github.com/blueimp/jQuery-File-Upload)
* [jQuery](http://jquery.com/)

License
------------
CC0 1.0 Universal
