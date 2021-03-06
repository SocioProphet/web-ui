module.exports = {
    template: require('shared-with-modal.html'),
    data: function() {
        return {
            showSpinner: false,
            errorTitle:'',
            errorBody:'',
            showError:false
        }
    },
    props: ['data', 'files', 'context'],
    created: function() {
    },
    methods: {
        close: function () {
            this.showSpinner = false;
            this.$emit("hide-shared-with");
        },
        unshare : function (targetUsername, sharedWithAccess) {
            if (this.files.length == 0)
                return this.close();
            if (this.files.length != 1)
                throw "Unimplemented multiple file share call";

            var that = this;
            this.showSpinner = true;
            var filename = that.files[0].getFileProperties().name;
            if(sharedWithAccess == "Read") {
                this.context.unShareReadAccess(this.files[0], targetUsername)
                    .thenApply(function(b) {
                        that.showSpinner = false;
                        console.log("unshared read access to " + that.files[0].getFileProperties().name + " with " + targetUsername);
                        that.$emit("update-shared");
                    }).exceptionally(function(throwable) {
                        that.showSpinner = false;
                        that.errorTitle = 'Error unsharing file: ' + filename;
                        that.errorBody = throwable.getMessage();
                        that.showError = true;
                    });

            } else {
                this.context.unShareWriteAccess(this.files[0], targetUsername)
                    .thenApply(function(b) {
                        that.showSpinner = false;
                        console.log("unshared write access to " + that.files[0].getFileProperties().name + " with " + targetUsername);
                        that.$emit("update-shared");
                    }).exceptionally(function(throwable) {
                        that.showSpinner = false;
                        that.errorTitle = 'Error unsharing file: ' + filename;
                        that.errorBody = throwable.getMessage();
                        that.showError = true;
                    });
            }
        }
    }
}
