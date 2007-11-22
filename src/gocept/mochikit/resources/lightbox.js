// Lightbox functionality

gocept.Lightbox = gocept.Class.extend({

    construct: function(parent_element) {
        this.parent_element = parent_element;
        this.shade = DIV({'id': 'lightbox-shade'})
        this.content_box = DIV({'id': 'lightbox'});
        appendChildNodes(this.parent_element, this.shade, this.content_box);
        connect(this.shade, 'onclick', this, 'hide_lightbox');

       
    },

    hide_lightbox: function() {
        disconnectAll('lightbox-shade');
        disconnectAll('lightbox');
        removeElement('lightbox-shade');
        removeElement('lightbox');
    },
    
    load_url: function(url) {
        var othis = this;
        this.replace_content("Loading ...");
        var d = doSimpleXMLHttpRequest(url);
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
