/**
 *
 * Lead Capture Script
 * Version: v1.0.0
 * Authors: Austen Collins
 * Contact: austen@servant.co
 *
 * Insert this script right before the closing body tag.  Right before this: </body>
 *
 */


(function(root) {

    // Establish root object, 'window' in the browser
    root.LeadCapture = root.LeadCapture || {};
    var LeadCapture = root.LeadCapture;

    /**
     * General Function To Call the Lead Capture API
     */
    LeadCapture._callAPI = function(method, path, json, success, failed) {

        // if (this.status !== "has_token") return console.error('Lead Capture Script Error – Here');

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState < 4)
                return;
            if (xhr.status !== 200)
                return failed.call(window, JSON.parse(xhr.responseText));
            if (xhr.readyState === 4) {
                success.call(null, JSON.parse(xhr.responseText));
            }
        };

        xhr.open(method.toUpperCase(), path, true);
        if (json) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(json));
        } else {
            xhr.send();
        }
    };

    /**
     * Initialize the Lead Capture Script
     */
    LeadCapture.initialize = function() {

        // Get Settings
        var scriptElement = document.getElementById('lead-capture-script-tag');

        // Set Defaults
        var self = this;
        self._development = scriptElement.getAttribute('data-development');
        self._dashboard = scriptElement.getAttribute('data-dashboard');
        self._domain = scriptElement.getAttribute('data-domain');
        self._url = self._development === 'true' ? window.location.protocol + '//localhost:8080/api/1/' + self._domain : window.location.protocol + '//lead-capture.herokuapp.com/api/1/' + self._domain ;
        self._elements = {};
        self._listeners = {};

        // Fetch Initialization Data
        self._callAPI('GET', self._url , null, function(response) {
            console.log("LeadCapture Script Initialized: ", response);
            self._domain_data = response;

            // Inject Overlay Element
            self._elements.overlay = document.createElement('div');
            self._elements.overlay.id = "lc-overlay";
            self._elements.overlay.style.position = 'absolute';
            self._elements.overlay.style.left = '0px';
            self._elements.overlay.style.top = '0px';
            self._elements.overlay.style.width = '100%';
            self._elements.overlay.style.height = '100%';
            self._elements.overlay.style.textAlign = '0px';
            self._elements.overlay.style.zIndex = 9000;
            self._elements.overlay.style.background = 'rgba(0,0,0,0)';
            self._elements.overlay.style.display = 'none';
            document.body.appendChild(self._elements.overlay);

            // Set-Up All Popups
            for(i=0;i<self._domain_data.popups.length;i++) {
                // Set-Up Events
                for(i2=0;i2<self._domain_data.popups[i].events.length;i2++) {
                
                    // Timer Event
                    if (self._domain_data.popups[i].events[i2].type === 'timer') {
                        // Set Timer
                        setTimeout(function(popup){
                            return function() { self.showPopup(popup) }
                        }(self._domain_data.popups[i]), self._domain_data.popups[i].events[i2].time);

                    }
                    // Click Event
                    if (self._domain_data.popups[i].events[i2].type === 'click') {
                        var form = self._domain_data.popups[i];
                        document.getElementById(self._domain_data.popups[i].events[i2].elementID).addEventListener("click", function(){
                            self.showPopup(form); 
                        });
                    }
                    // Exit Event
                    // Scroll Event
                }
            }
        }, function(error) {
            console.log(error);
        });

        // Set-Up popup
        setTimeout(function() {
            var popupElement = document.getElementById('lead-capture-popup');
            if (popupElement) popupElement.addEventListener("submit", function() {
                self.submitPopup();
            });
        },2000);
    };

    /**
     * Submit Popup Data to Lead Capture API
     */
    LeadCapture.submitPopup = function() {
        // Defaults
        var self = this;
        var popupData = { tags: [] };
        // Get Popup Element
        var popupElement = document.getElementById('lc-popup');

        // Get All Input Values
        var inputElements = popupElement.getElementsByTagName('input');
        for(i=0;i<inputElements.length;i++) {
            if (['text','email'].indexOf(inputElements[i].type) > -1) popupData[inputElements[i].name] = inputElements[i].value;
        };

        // Get All Select Fields
        var selectElements = popupElement.getElementsByTagName('select');
        for(i=0;i<selectElements.length;i++) {
            popupData.tags.push(selectElements[i].value);
        };

        // Hide Button
        document.getElementById('lc-popup-actions').style.display = 'none';

        // Show Success
        document.getElementById('lc-success').style.display = 'block';
        document.getElementById('lc-success-close').style.display = 'block';

        console.log("LeadCapture Popup Submitted: ", popupData);

        // self._callAPI('POST', self._url + 'capture/popup', popupData, function(response) {
        //     console.log(response);
        //     var successElement = document.getElementById('lead-capture-success');
        //     console.log(successElement);
        //     successElement.innerHTML = response.success;
        //     successElement.style.display = 'block';
        //     setTimeout(function() {
        //         successElement.style.display = 'none';
        //     },5000);
        // }, function(error) {
        //     console.log(error);
        //     var errorElement = document.getElementById('lead-capture-error');
        //     errorElement.innerHTML = error.error;
        //     errorElement.style.display = 'block';
        //     setTimeout(function() {
        //         errorElement.style.display = 'none';
        //     },5000);
        // });

        // Prevent Popup Submitting
        return false;
    }  

    /**
     * Close Pop-Up
     */
    LeadCapture.closePopup = function() { 
        this._elements.overlay.style.display = 'none'; 
    }

    /**
     * Show Pop-Up Trigger
     */
    LeadCapture.showPopup = function(popup) {
        var self = this;
        console.log("LeadCapture Popup Triggered: ", popup);

        // Check if PopUp is already being shown

        // Clear Previous PopUp
        self._elements.overlay.innerHTML = '';

        /**
         * Create New PopUp
         */
        
        // Create Styles
        var popupHTML = '<style>';
        popupHTML = popupHTML + '#lc-popup { width:100%;max-width:600px;min-height:400px;margin:5% auto 0px auto;background:#ffffff;padding:25px;-webkit-border-radius: 6px;border-radius: 6px; }';
        popupHTML = popupHTML + '#lc-success { text-align:center;font-size:16px;margin:55px 0px 10px 0px;}';
        popupHTML = popupHTML + '#lc-success-close { text-align:center;font-size:16px;margin:0px 0px 50px 0px;text-decoration:underline;}';
        popupHTML = popupHTML + '#lc-success-close:hover { cursor:pointer }';
        popupHTML = popupHTML + '#lc-cta1 { text-align:center}';
        popupHTML = popupHTML + '#lc-cta2 { text-align:center}';
        popupHTML = popupHTML + '#lc-popup-actions { display:block;width:100%;text-align:center;margin: 35px 0px; }';
        popupHTML = popupHTML + '#lc-submit-btn { font-size:25px;padding:10px 40px;color:#ffffff;background:#e8544c;border:none;-webkit-box-shadow: 0px 3px 0px 0px #c4443d;box-shadow: 0px 3px 0px 0px #c4443d;-webkit-border-radius:3px;border-radius:3px;text-shadow:none;-webkit-transition: all 0.3s ease-out;  /* Saf3.2+, Chrome */ -moz-transition: all 0.3s ease-out;  /* FF4+ */ -ms-transition: all 0.3s ease-out;  /* IE10 */ -o-transition: all 0.3s ease-out;  /* Opera 10.5+ */ transition: all 0.3s ease-out;}';
        popupHTML = popupHTML + '#lc-submit-btn:hover {cursor:pointer;background:#ff6d65;}';
        popupHTML = popupHTML + '#lc-cancel-link {text-align:center;font-size:20px;color:rgba(0,0,0,0.8);margin-top:15px;}';
        popupHTML = popupHTML + '#lc-cancel-link:hover {cursor:pointer;color:rgba(0,0,0,0.5);}';
        popupHTML = popupHTML + '.lc-field { display:block;width:100%;margin:15px auto;text-align:center;}';
        popupHTML = popupHTML + '.lc-label { margin:0px 0px 5px 0px;text-align:center;font-weight:bold;}';
        popupHTML = popupHTML + '.lc-input { width:100%;max-width:300px;margin:0px auto;padding:8px;font-size:16px;text-align:center;border: 1px solid rgba(0, 0, 0, 0.15);-webkit-border-radius: 3px;border-radius: 3px;-webkit-box-shadow: inset 0px 1px 0px 0px #e9e9e9;box-shadow: inset 0px 1px 0px 0px #e9e9e9;}';
        popupHTML = popupHTML + '.lc-input:focus { border-color: rgba(0, 0, 0, 0.3);outline: 0;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2); }';
        popupHTML = popupHTML + '.lc-select-input { width:100%;max-width:300px;margin:0px auto;height:40px;font-size:16px;background: #ffffff;border: 1px solid rgba(0, 0, 0, 0.15);-webkit-border-radius: 3px;border-radius: 3px;-webkit-box-shadow: inset 0px 1px 0px 0px #E9E9E9;box-shadow: inset 0px 1px 0px 0px #E9E9E9;}';
        popupHTML = popupHTML + '</style>';
        // Create Popup Element
        popupHTML = popupHTML + '<div id="lc-popup">';
        // Add CTA1
        popupHTML = popupHTML + '<h1 id="lc-cta1">' + popup.cta1  + '</h1>';
        // Add CTA2
        popupHTML = popupHTML + '<p id="lc-cta2">' + popup.cta2  + '</p>';
        // Add Fields
        for(i=0;i<popup.blocks.length;i++) {
            // Full Name
            if (popup.blocks[i].type === 'full_name') {
                popupHTML = popupHTML + '<div class="lc-field lc-full-name">';
                popupHTML = popupHTML + '<p id="lc-label-full-name" class="lc-label">Full Name</p>';
                popupHTML = popupHTML + '<input type="text" name="full_name" id="lc-input-full-name" class="lc-input" max-length="50" placeholder="John Smith">';
                popupHTML = popupHTML + '</div>';
            }
            // Email
            if (popup.blocks[i].type === 'email') {
                popupHTML = popupHTML + '<div class="lc-field lc-email">';
                popupHTML = popupHTML + '<p id="lc-label-email" class="lc-label">Email</p>';
                popupHTML = popupHTML + '<input type="email" name="email" id="lc-input-email" class="lc-input" max-length="50" placeholder="john@gmail.com">';
                popupHTML = popupHTML + '</div>';
            }
            // Select
            if (popup.blocks[i].type === 'select') {
                popupHTML = popupHTML + '<div class="lc-field lc-select">';
                popupHTML = popupHTML + '<p id="lc-label-select-' + i + '" class="lc-label">' + popup.blocks[i].title + '</p>';
                popupHTML = popupHTML + '<select id="lc-input-select-' + i + '" class="lc-select-input" >';
                for (i2=0;i2<popup.blocks[i].options.length;i2++) {
                    popupHTML = popupHTML + '<option value="' + popup.blocks[i].options[i2] + '">' + popup.blocks[i].options[i2] + '</option>';
                }
                popupHTML = popupHTML + '</select>';
                popupHTML = popupHTML + '</div>';
            }

        }
        // Create Success Message
        popupHTML = popupHTML + '<p id="lc-success" style="display:none;">You have been added to the list!</p>';
        // Success Close Modal
        popupHTML = popupHTML + '<p id="lc-success-close" style="display:none;">Close this pop-up</p>';
        // Add Buttons
        popupHTML = popupHTML + '<div id="lc-popup-actions">';
        popupHTML = popupHTML + '<p style="text-align:center;"><button id="lc-submit-btn">Submit</button></p>';
        popupHTML = popupHTML + '<p id="lc-cancel-link">Cancel</p>';
        // Close Popup Element
        popupHTML = popupHTML + '</div>';
        self._elements.overlay.innerHTML = popupHTML;
        // Style Overlay
        self._elements.overlay.style.background = 'rgba(0,0,0,0.7)';
        // Show PopUp
        self._elements.overlay.style.display = 'block';
        // Add Listener to Submit Popup
        document.getElementById("lc-submit-btn").addEventListener("click", function(){
            self.submitPopup();
        });
        // Add Listener to Close Popup
        document.getElementById("lc-cancel-link").addEventListener("click", function(){
            self.closePopup();
        });
        // Add Listener to Close Popup
        document.getElementById("lc-success-close").addEventListener("click", function(){
            self.closePopup();
        });
    }

    // Initialize Script
    LeadCapture.initialize();

}(this));  // Anonymous Function


    







