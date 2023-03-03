let $submitButton = $('.submitButton');
$submitButton.click(function () {
  respondToForm();
});
let $clearButton = $('.clearButton');
$clearButton.click(function () {
  $('#response-area').empty();
});

function respondToForm () {
    if ($('#type').val() == 'GET') {
        console.log('GETting all data from table: ', $('#table').val());
        let searchString;
        if ($('#table').val() == 'deposits' && $('#accountID').val() != '') {
            console.log('accountID: ', $('#accountID').val());
            searchString = 'http://localhost:8000/api/accounts/' + $('#accountID').val() + '/' + $('#table').val()
        }
        else if ($('#table').val() == 'accounts' && $('#accountID').val() != null) {
            searchString = 'http://localhost:8000/api/' + $('#table').val()+'/' + $('#accountID').val();
        }
        else if ($('#table').val() == 'deposits' && $('#depositID').val() != null) {
            searchString = 'http://localhost:8000/api/' + $('#table').val() + '/' + $('#depositID').val();
        }
        else {
            searchString = 'http://localhost:8000/api/' + $('#table').val()
        }
        console.log('searchString: ', searchString);
        $.get(searchString, (data) => { 
            console.log('data: ', data);
            $('#response-area').append(`<pre>${JSON.stringify(data)}</pre>`);
        });
    }
    else if ( $('#type').val() == 'POST' ) {
        $.ajax({
            url: `http://localhost:8000/api/${$('#table').val()}`,
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