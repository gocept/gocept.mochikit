/* adapted from <http://www.zentus.com/js/xmlrpc.js>
 *
 * Copyright (c) 2008 David Crawshaw <david@zentus.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

gocept.xmlrpc = {};


gocept.xmlrpc.call = function(url, method, params) {
    var d = MochiKit.Async.doXHR(url, {
        'method': 'POST',
        'headers': {'Content-Type': 'text/xml'},
        'sendContent': gocept.xmlrpc.convert_call(method, params) });
    d.addCallback(function(result) {
        return gocept.xmlrpc.parse_response(result.responseXML);
    });
    return d;
};


gocept.xmlrpc.convert_call = function(method, params) {
    out = "<?xml version=\"1.0\"?>\n";
    out += "<methodCall>\n";
    out += "<methodName>"+ method + "</methodName>\n";

    if (params && params.length > 0) {
        out += "<params>\n";
        for (var i=0; i < params.length; i++) {
            out += "<param><value>";
            out += gocept.xmlrpc.convert_param(params[i]);
            out += "</value></param>";
        }
        out += "</params>\n";
    }

    out += "</methodCall>\n";
    return out;
};


gocept.xmlrpc.convert_param = function(param) {
    if (param == null)
        return "<nil />";
    switch (typeof(param)) {
        case "boolean":     return "<boolean>" + param + "</boolean>";
        case "string":
            param = param.replace(/</g, "&lt;");
            param = param.replace(/&/g, "&amp;");
            return "<string>" + param + "</string>";
        case "undefined":   return "<nil/>";
        case "number":
            return /\./.test(param) ?
                "<double"> + param + "</double>" :
                "<int>" + param + "</int>";
        case "object":
            if (param.constructor == Array) {
                out = "<array><data>\n";
                for (var i in param) {
                    out += "  <value>";
                    gocept.xmlrpc.writeParam(param[i]);
                    out += "</value>\n";
                }
                out += "</data></array>";
                return out;
            } else if (param.constructor == Date) {
                out = "<dateTime.iso8601>";
                out += param.getUTCFullYear();
                if (param.getUTCMonth() < 10)
                    out += "0";
                out += param.getUTCMonth();
                if (param.getUTCDate() < 10)
                    out += "0";
                out += param.getUTCDate() + "T";
                if (param.getUTCHours() < 10)
                    out += "0";
                out += param.getUTCHours() + ":";
                if (param.getUTCMinutes() < 10)
                    out += "0";
                out += param.getUTCMinutes() + ":";
                if (param.getUTCSeconds() < 10)
                    out += "0";
                out += param.getUTCSeconds();
                out += "</dateTime.iso8601>";
                return out;
            } else { /* struct */
                out = "<struct>\n";
                for (var i in param) {
                    out += "<member>";
                    out += "<name>" + i + "</name>";
                    out += "<value>" + gocept.xmlrpc.writeParam(param[i]) + "</value>";
                    out += "</member>\n";
                }
                out += "</struct>\n";
                return out;
            }
    }
};


gocept.xmlrpc.parse_response = function(dom) {
    var methResp = dom.childNodes[dom.childNodes.length - 1];
    if (methResp.nodeName != "methodResponse")
        throw "malformed <methodResponse>, got " + methResp.nodeName;

    // XXX this is fragile with respect to textNodes (e. g. newlines)
    // in the server output
    var params = methResp.childNodes[1];
    if (params.nodeName == "fault")  {
        var fault = gocept.xmlrpc.parse(params.childNodes[1]);
        throw fault["faultString"];
    }
    if (params.nodeName != "params")
        throw "malformed <params>, got <" + params.nodeName + ">";

    var param = params.childNodes[1];
    if (param.nodeName != "param")
        throw "malformed <param>, got <" + param.nodeName + ">";

    var value = param.childNodes[1];
    if (value.nodeName != "value")
        throw "malformed <value>, got <" + value.nodeName + ">";

    return gocept.xmlrpc.parse(value);
};


gocept.xmlrpc.parse = function(value) {
    if (value.nodeName != "value")
        throw "parser: expected <value>";

    var type = value.childNodes[0];
    if (type == null)
        throw "parser: expected <value> to have a child";
    switch (type.nodeName) {
        case "boolean":
            return type.childNodes[0].data == "1" ? true : false;
        case "i4":
        case "int":
            return parseInt(type.childNodes[0].data);
        case "double":
            return parseFloat(type.childNodes[0].data);
        case "#text": // Apache XML-RPC 2 doesn't wrap strings with <string>
            return type.data;
        case "string":
            return type.childNodes[0].data;
        case "array":
            var data = type.childNodes[0];
            var res = new Array(data.childNodes.length);;
            for (var i=0; i < data.childNodes.length; i++)
                res[i] = gocept.xmlrpc.parse(data.childNodes[i]);
            return res;
        case "struct":
            var members = type.childNodes;
            var res = {};
            for (var i=0; i < members.length; i++) {
                var name = members[i].childNodes[0].childNodes[0].data;
                var value = gocept.xmlrpc.parse(members[i].childNodes[1]);
                res[name] = value;
            }
            return res;
        case "dateTime.iso8601":
            var s = type.childNodes[0].data;
            var d = new Date();
            d.setUTCFullYear(s.substr(0, 4));
            d.setUTCMonth(parseInt(s.substr(4, 2)) - 1);
            d.setUTCDate(s.substr(6, 2));
            d.setUTCHours(s.substr(9, 2));
            d.setUTCMinutes(s.substr(12, 2));
            d.setUTCSeconds(s.substr(15, 2));
            return d;
        case "base64":
            throw "parser: base64 not implemented";
        default:
            throw "parser: expected type, got <"+type.nodeName+">";
    }
};