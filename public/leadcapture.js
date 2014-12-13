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
        self._url = self._development === 'true' ? 'http://localhost:8080/api/1/' + self._domain + '/' : 'https://lead-capture.herokuapp.com/api/1/' + self._domain + '/';

        // Fetch Initialization Data
        self._callAPI('GET', self._url + 'initialize', null, function(response) {
            
            self._data = response;
            console.log(response);
            // Set Modal Timer
            


        }, function(error) {
            console.log(error);
        });

        // Set-Up Form
        setTimeout(function() {
            var formElement = document.getElementById('lead-capture-form');
            if (formElement) formElement.addEventListener("submit", function() {
                self.submitForm();
            });
        },2000);
    };

    /**
     * Submit Form Data to Lead Capture API
     */
    LeadCapture.submitForm = function() {
        // Defaults
        var self = this;
        var formData = {};
        // Get Form Element
        var formElement = document.getElementById('lead-capture-form');
        var inputElements = formElement.getElementsByTagName('input');

        // Loop Through Elements
        for(i=0;i<inputElements.length;i++) {
            if (['text','email'].indexOf(inputElements[i].type) > -1) formData[inputElements[i].name] = inputElements[i].value;
        };

        console.log(formData);

        self._callAPI('POST', self._url + 'capture/form', formData, function(response) {
            console.log(response);
            var successElement = document.getElementById('lead-capture-success');
            console.log(successElement);
            successElement.innerHTML = response.success;
            successElement.style.display = 'block';
            setTimeout(function() {
                successElement.style.display = 'none';
            },5000);
        }, function(error) {
            console.log(error);
            var errorElement = document.getElementById('lead-capture-error');
            errorElement.innerHTML = error.error;
            errorElement.style.display = 'block';
            setTimeout(function() {
                errorElement.style.display = 'none';
            },5000);
        });

        // Prevent Form Submitting
        return false;
    }   

    /**
     * Show Modal Trigger
     */
    LeadCapture.showModal = function() {


    }

    // Initialize Script
    LeadCapture.initialize();

}(this));  // Anonymous Function


    







