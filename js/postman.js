console.log('welcome to postmaster app');

//Initialize no. of parameters
let addedParamCount = 0;

//Hid the parameters box initially
let parametersBox = document.getElementById('parameters');
parametersBox.style.display = 'none';


//If the user clicks on params box, hide the json box
let paramsRadio = document.getElementById('paramsradio');
paramsRadio.addEventListener('click',()=>{
    document.getElementById('parameters').style.display = 'block';
    document.getElementsByClassName('req_json')[0].style.display = 'none';

})

//If the user clicks on json box, hide the params box
let jsonRadio = document.getElementById('jsonradio');
jsonRadio.addEventListener('click',()=>{
    document.getElementById('parameters').style.display = 'none';
    document.getElementsByClassName('req_json')[0].style.display = 'flex';
})



let addParam = document.getElementById('addBtn');
//Event Listener to add or remove parameters
parametersBox.addEventListener('click',(e)=>{
    // console.log(e.target.id);
    let regex = /^deleteParam/;
    let str  = e.target.id;
    //If the user cilcks on + button, add more parameters
    if (e.target.id == 'addBtn'){
        let div = document.createElement('div');
        div.className = 'custom_params';
        div.id = `param${addedParamCount + 2}`;
        div.innerHTML = `<label for="custParam${addedParamCount + 2}">Parameter ${addedParamCount + 2}</label>
                         <div class="paramContainer">
                            <input type="text" class="custParams" name="" placeholder="Enter Parameter ${addedParamCount + 2} key" />
                            <input type="text" class="custParamVal" name="" placeholder="Enter Parameter ${addedParamCount + 2} value" />
                            <i class="fas fa-minus-circle" id="deleteParam${addedParamCount + 2}"></i>
                         </div>`;
        parametersBox.appendChild(div);
        addedParamCount++;
    }
    //If the user cilcks on - button, delete parameters
    else if(regex.test(str)){
        console.log('deleteing parameter');
        let childToRemove = document.getElementById(e.path[2].id);
        // TODO: add a confirmation box to confirm parameter deletion
        childToRemove.remove();
    }
    
})

function requestContent(event){
    event.preventDefault();
    //Show please wait in the response box to request patience  from the user
    document.getElementById('resp').innerHTML = "Please wait.. Fetching response...";
    //fetch all the values user has entered
    let url = event.target.givenUrl.value;
    let request_type = event.target.re_type.value;
    let content_type = event.target.con_type.value;

    // Validate all fields
    if(url == ''){
        document.getElementById('warning').style.display = 'block';
        document.getElementById('warning').innerHTML = '<small>Please enter URL</small>';
        setTimeout(()=>{
            document.getElementById('warning').style.display = 'none';
        },3000);
        return;
    }
    else if(!document.getElementById('get').checked && !document.getElementById('post').checked) {
        document.getElementById('warning').style.display = 'block';
        document.getElementById('warning').innerHTML = '<small>Please Select Request Type</small>';
        setTimeout(()=>{
            document.getElementById('warning').style.display = 'none';
        },3000);
        return;
    }
    else if(request_type == 'POST'){
        if (!document.getElementById('jsonradio').checked && !document.getElementById('paramsradio').checked){
            document.getElementById('warning').style.display = 'block';
            document.getElementById('warning').innerHTML = '<small>Please Select Content Type</small>';
            setTimeout(()=>{
                document.getElementById('warning').style.display = 'none';
            },3000);
            return;
        }
        else if(content_type == 'JSON'){
            if (event.target.re_Json.value == ''){
                document.getElementById('warning').innerHTML = '<small>Please Enter request Json</small>';
                document.getElementById('warning').style.display = 'block';
                setTimeout(()=>{
                    document.getElementById('warning').style.display = 'none';
                },3000);
                return;
            }
        }
    }


    //If user has used params option instead of json, collect all the parameters in an object
    if(content_type == 'Custom Parameters'){
        data = {
        }
        let allParams = document.getElementsByClassName('custom_params');
        for(Param of allParams){
            console.log(Param.children[1].firstElementChild);
            let key = Param.children[1].children[0].value;
            let value = Param.children[1].children[1].value;
            data[key]=value;
        }
        data = JSON.stringify(data);
    }
    else {
        data = event.target.re_Json.value;
    };

    // Log all the values in the console for debugging
    console.log('url is ',url);
    console.log('request_type is ',request_type);
    console.log('content_type is ',content_type);
    console.log('data is ',data);

    //If the request type is get, invoke fetch api to create a post request
    if (request_type == 'GET'){
        // https://randomuser.me/api/
            fetch(url, {
                method: 'GET'
            })
            .then(response => response.text())
            .then(text => {
                document.getElementById('resp').innerHTML = text;
            })
    }
    else if(request_type == 'POST'){
        console.log('POSTING request');
        let params = {
            method: 'post',
            headers: {
            'content-Type': 'application/json'
            },
            body: data
            //if your data is object (not string)
            //then use body: json.stringify(data);
            }    
            // https://jsonplaceholder.typicode.com/posts             
    fetch(url,params).then(response => response.text())
    .then(text => {
        document.getElementById('resp').innerHTML = text;
    })
    }
    document.getElementById('subForm').reset();
}



