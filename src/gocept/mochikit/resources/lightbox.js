// Lightbox functionality

gocept.Lightbox = gocept.Class.extend({

    construct: function(parent_element) {
        this.parent_element = parent_element;
        this.shade = DIV({'id': 'lightbox-shade'})
        this.header = DIV({'id': 'lightbox-header'});
        this.closebutton = A({'href': '#', 
                              'title': 'Close',
                              'class': 'CloseButton'});
        this.content_box = DIV({'id': 'lightbox'});
        appendChildNodes(this.header, this.closebutton);
        appendChildNodes(this.parent_element, this.shade, this.header, this.content_box);
        connect(this.closebutton, 'onclick', this, 'close');
        connect(this.shade, 'onclick', this, 'close');

    },

    close: function() {
        MochiKit.Signal.signal(this, 'before-close');
        disconnectAll('lightbox-shade');
        disconnectAll('lightbox');
        removeElement('lightbox-shade');
        removeElement('lightbox');
        removeElement('lightbox-header');
    },
    
    load_url: function(url, query) {
        if (query == undefined) {
            query = {}
        }

        var othis = this;
        this.replace_content("Loading ...");
        var d = doSimpleXMLHttpRequest(url, query);
        d.addCallbacks(
            function(result) {
                return result.responseText;
            },
            function(error) {
                return "There was an error loading the content: " + error 
            });
        d.addCallback(function(result) {
            othis.replace_content(result);
            return result;
        });
        return d;
    },

    replace_content: function(new_html) {
        $('lightbox').innerHTML = new_html;
    },

});
