
// Declare Variables
const route = 'https://money-test.onrender.com';
let $tableValue;
let $typeValue;
let $accountID;
let $depositID;

// Function to get new values from form
function getFormInfo () {
    $tableValue = $('#table').val();
    $typeValue = $('#type').val();
    $accountID = $('#accountID').val();
    $depositID = $('#depositID').val();
}

// Assign actions to buttons
let $submitButton = $('.submitButton');
$submitButton.click(function () {
  getFormInfo();
  respondToForm();
});
let $clearButton = $('.clearButton');
$clearButton.click(function () {
  $('#response-area').empty();
});

// DO SOMETHING when 'Submit Request' is clicked
function respondToForm () {
    if ($typeValue == 'GET') {
        console.log('GETting all the data from table: ', $tableValue);
        let searchString;
        if ($tableValue == 'deposits' && $accountID != '') {
            console.log('accountID: ', $accountID);
            searchString = route + '/api/accounts/' + $accountID + '/' + $tableValue;
        }
        else if ($tableValue == 'accounts' && $accountID != '') {
            searchString = route + '/api/' + $tableValue+'/' + $accountID;
        }
        else if ($tableValue == 'deposits' && $depositID != '') {
            searchString = route + '/api/' + $tableValue + '/' + $depositID;
        }
        else {
            searchString = route + '/api/' + $tableValue;
        }
        console.log('searchString: ', searchString);
        $.get(searchString, (data) => { 
            console.log('data: ', data);
            $('#response-area').append(`<pre>${JSON.stringify(data)}</pre>`);
        });
    }
    else if ( $('#type').val() == 'POST' ) {
        $.ajax({
            url: `/api/${$('#table').val()}`,
            type: 'POST',
            dataType: 'json',
            data: $('#table').val(),
            success: function (data, textStatus, xhr) {
                console.log(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }
    else if ( $('#type').val() == 'PATCH' ) {

    }
    else if ( $('#type').val() == 'DELETE' ) {

    }
}