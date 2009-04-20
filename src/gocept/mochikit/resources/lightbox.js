// Lightbox functionality

gocept.Lightbox = gocept.Class.extend({

    default_options: {
        use_ids: true,
    },

    construct: function(parent_element, option_args) {
        var options = MochiKit.Base.clone(this.default_options);
        if (!isUndefinedOrNull(option_args)) {
            MochiKit.Base.update(options, option_args);
        }

        this.parent_element = parent_element;
        this.shade = DIV({'class': 'lightbox-shade'})
        this.header = DIV({'class': 'lightbox-header'});
        this.closebutton = A({'href': '#', 
                              'title': 'Close',
                              'class': 'CloseButton'});
        this.content_box = DIV({'class': 'lightbox'});

        if (options.use_ids) {
            forEach([this.shade, this.header, this.content_box],
                    function(element) {
                        element.id = element.getAttribute('class');
            });
        }

        MochiKit.DOM.appendChildNodes(this.header, this.closebutton);
        MochiKit.DOM.appendChildNodes(
            this.parent_element, this.shade, this.header, this.content_box);
        this.events = []
        this.events.push(
            MochiKit.Signal.connect(
                this.closebutton, 'onclick', this, this.close));
        this.events.push(
            MochiKit.Signal.connect(
                this.shade, 'onclick', this, this.close));
    },

    close: function() {
        MochiKit.Signal.signal(this, 'before-close');
        while (this.events.length) {
            MochiKit.Signal.disconnect(this.events.pop());
        }

        forEach([this.shade, this.header, this.content_box],
                function(element) {
                    MochiKit.Signal.disconnectAll(element);
                    if (!isNull(element.parentNode)) {
                        MochiKit.DOM.removeElement(element);
                    }
        });
    },
    
    load_url: function(url, query) {
        if (query == undefined) {
            query = {}
        }

        var othis = this;
        if (this.innerHTML == "") {
            this.replace_content("Loading ...");
        }
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
        this.content_box.innerHTML = new_html;
    },

});
