module.exports = {
    template: require('gallery.html'),
    data: function() {
        return {
	    showSpinner: false,
	    fileIndex: -1,
	    imageData: null
        };
    },
    props: ['show', 'files', 'context'],
    created: function() {
	console.debug('Gallery module created!');
	this.updateImageData();
    },
    
    methods: {
	close: function() {
	    this.show = false;
	},
	
	start: function() {
	    this.fileIndex = 0;
	    this.updateImageData();
	},

	end: function() {
	    if (this.files == null || this.files.length == 0)
		this.fileIndex = 0;
	    else
		this.fileIndex = this.files.length - 1;
	    this.updateImageData();
	},

	next: function() {
	    if (this.files == null || this.files.length == 0)
		this.fileIndex = 0;
	    else
		this.fileIndex++;
	    this.updateImageData();
	},

	previous: function() {
	    if (this.files == null || this.files.length == 0 || this.fileIndex == 0)
		this.fileIndex = 0;
	    else
		this.fileIndex--;
	    this.updateImageData();
	},

	updateImageData: function() {
	    var file = this.current;
	    if (file == null)
		return;
	    console.log("downloading " + file.getFileProperties().name);
	    var props = file.getFileProperties();
	    var that = this;
	    var resultingSize = props.sizeLow();
	    
	    file.getInputStream(this.context, props.sizeHigh(), props.sizeLow(), function(read) {})
		.thenCompose(function(reader) {
		    var data = convertToByteArray(new Int8Array(props.sizeLow()));
		    data.length = props.sizeLow();
		    return reader.readIntoArray(data, 0, data.length)
			.thenApply(function(read){
			    that.imageData = data;
			    console.log("Finished retrieving image of size " + data.length);
			});
		});
	}
    },
    computed: {
	current: function() {
	    if (this.files == null || this.files.length == 0)
		return null;
	    return this.files[this.fileIndex];
	},
	
	imageURL: function() {
	    console.log("Getting image url");
	    if (this.imageData == null)
		return null;
	    var blob =  new Blob([this.imageData], {type: "octet/stream"});		
	    var imageUrl = window.URL.createObjectURL(blob);
	    console.log("Setting image url to " + imageUrl);
	    return imageUrl;
	}
    }
};
