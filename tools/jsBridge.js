function callNative(data) {
    //call native method
    if (!window.WebViewJavascriptBridge) return;
    window.WebViewJavascriptBridge.callHandler(
        'submitFromWeb'
        , data
        , function(responseData) {

        }
    );
}

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}
function init() {
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };

            if (responseCallback) {
                console.log('JS responding with', data);
                responseCallback(data);
            }
        });

        bridge.registerHandler("functionInJs", function(data, responseCallback) {

        });
    })
}

export {init};
export {callNative};