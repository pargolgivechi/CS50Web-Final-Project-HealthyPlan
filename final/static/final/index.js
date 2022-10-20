document.addEventListener('DOMContentLoaded', function() {

    const meal = document.querySelectorAll('.meal');
    const track = document.querySelector('.track');
    const plan = document.querySelector('.plan');
    const recipe = document.querySelector('.recipe');
    const title = document.querySelector('#title');
    const form = document.querySelector('.form');
    const information = document.querySelector('.information');
    const editForm = document.querySelector('.editForm');
    const edit = document.querySelector('.edit');
    const historyPage = document.querySelector('.historyPage');
    const one_history = document.querySelector('.one_history');
    const back2 = document.querySelector('.back-2');
    const trackForm = document.querySelector('.trackForm');
    const show = document.querySelector('.show');
    const msg2 = document.querySelector('.msg-2');
    const pick = document.querySelector('.pick');


    editForm && (editForm.style.display = 'none');
    one_history && (one_history.style.display = 'none');
    back2 && (back2.style.display = 'none');
    show && (show.style.display = 'none');
    pick && (pick.style.display = 'block');


    meal && (meal.forEach(element => {element.onclick = function() {
        fetch(`/plan/${title.textContent}/${this.parentElement.className}/${this.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            
            plan.style.display = 'none';

            const content = `
            <div class="p-4 mb-4 perMeal">
                <div class="mt-5 shadow-lg rounded">
                    <img src="../../static/final/${data.meal.img}" alt="" class="img-fluid image3 rounded">
                    <div class="p-5">
                        <h1 class="display-5"><strong>${data.meal.meal_title}</strong></h1>
                        <div class="p-4 mt-5 mb-5">
                            <h6 class="mb-4"><strong class="h4">Calories:</strong> <span class="lead">${data.meal.calories} kcl</span></h6>
                            <p><strong class="h4">Recipe:</strong> <span class="lead">${data.meal.recipe}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            `
            create_element(content, recipe)    
        })
    }}))

    
    // Form submit
    form && (form.onsubmit = function(e){
        const weight = document.querySelector('.weight').value
        const target = document.querySelector('.target').value
        const weight_loss = weight-target

        const cal = document.querySelector('.gender').value == 'Male' ? 2000 : 1800
        const daily_cal = cal-(weight_loss*20)
        const dietPlan = document.querySelector('.dietPlan').value 
        
        if ( target > weight ){

            document.querySelector('.target').classList.add('is-invalid');
            document.querySelector('.invalidTarget').classList.add('text-danger');
            document.querySelector('.invalidTarget').textContent = 'The target is bigger than the weight, please re-enter the target.'

        }else{

            fetch(`/profile_submit/${dietPlan}`,{
                method: 'POST',
                body: JSON.stringify({
                    gender: document.querySelector('.gender').value,
                    weight: document.querySelector('.weight').value,
                    height: document.querySelector('.height').value,
                    target: document.querySelector('.target').value,
                    daily_cal: daily_cal
                })
            })
            .then(response => response.json())
            .then(result => {
    
                console.log(result)
                location.replace("/profile")
            })

        }
        e.preventDefault();
    })


    // Edit Profile
    edit && (edit.onclick = function(e){
        information.style.display = 'none';
        editForm.style.display = 'block';

        document.querySelector('.editWeight').value = document.querySelector('.wei').textContent;
        document.querySelector('.editHeight').value = document.querySelector('.hei').textContent;
        document.querySelector('.editGender').value = document.querySelector('.gen').textContent;
        document.querySelector('.editTarget').value = document.querySelector('.tar').textContent;
        document.querySelector('.editPlan').value = document.querySelector('.pla').textContent;
        
        editForm.onsubmit = function(e){

            const editWeight = document.querySelector('.editWeight').value
            const editTarget = document.querySelector('.editTarget').value
            const weight_loss = editWeight-editTarget

            const cal = document.querySelector('.editGender').value == 'Male' ? 2000 : 1800
            const daily_cal = cal-(weight_loss*20)
            const editPlan = document.querySelector('.editPlan').value  

            if ( editTarget > editWeight ){

                document.querySelector('.editTarget').classList.add('is-invalid');
                document.querySelector('.invalidTarget2').classList.add('text-danger');
                document.querySelector('.invalidTarget2').textContent = 'The target is bigger than the weight, please re-enter the target.'

            }else{

                fetch(`/edit_profile/${editPlan}`,{
                    method: 'PUT',
                    body: JSON.stringify({
                        weight: document.querySelector('.editWeight').value,
                        height: document.querySelector('.editHeight').value,
                        gender: document.querySelector('.editGender').value,
                        target: document.querySelector('.editTarget').value,
                        daily_cal: daily_cal
                    })
                })
                .then(response => response.json())
                .then(result => {
    
                    console.log(result)
                    location.replace("/profile")
                })

            }
            e.preventDefault();
        }
    })


    // Add meal
    var cal_left = parseInt(document.querySelector('.dailyCal') && document.querySelector('.dailyCal').innerHTML);
    var initial_cal = cal_left;
    var total_cal = 0;

    // Chart
    var data1 = cal_left;
    var data2 = total_cal;

    const data = {
        labels:[],
        datasets: [{
        label:"Amount",
            data: [data1, data2],
            backgroundColor: [
                '#108310',
                'orange',
            ],
            borderWidth: 1,
            cutout: '87%'
        }]
    };

    const config = {
        type: "doughnut",
        data: data,
        options: {
            scales: {}
        }
    };

    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );


    const add = document.querySelectorAll('.add');
        add && (add.forEach(element => {element.onchange = function(e) {

            cal_left = initial_cal;
            data1 = cal_left/2

            total_cal = 0;
            data2 = total_cal

            var options = document.querySelectorAll('option:checked'); 
            options.forEach(el => {
                var x = el.value
                x = x.split(':')
                total_cal -= parseInt(x[1]);

                data2 = total_cal
            
                if(parseInt(x[1]) != 0) {
                    el.parentElement.classList.remove('is-invalid');
                    el.parentElement.nextElementSibling.style.display = 'none';
                }
            })
            
            cal_left += total_cal;
            document.querySelector('.dailyCal').innerHTML = cal_left;
            myChart.data.datasets[0].data[0] = data1;
            myChart.data.datasets[0].data[1] = data2;
            myChart.update();
            e.preventDefault()
        }}))


    track && (track.onsubmit = function(e) {
        const breakfast = document.querySelector('.breakfast').value;
        const lunch = document.querySelector('.lunch').value;
        const dinner = document.querySelector('.dinner').value;
        const snack = document.querySelector('.snack').value;
        const cal_left = document.querySelector('.dailyCal').innerHTML;
        const plan_nam = document.querySelector('#nam').innerHTML;


        if(breakfast == "0:0" || lunch == "0:0" || dinner == "0:0" || snack == "0:0"){
            
            var options = document.querySelectorAll('option:checked'); 
            options.forEach(el => {
                var x = el.value
                x = x.split(':')

                if(parseInt(x[1]) == 0) {
                    el.parentElement.classList.add('is-invalid');
                }
            })

        }else{

            var consumed_cal = initial_cal - cal_left;

            fetch('/track_calory',{
                method: 'POST',
                body: JSON.stringify({
                    cal_left: consumed_cal,
                    plan_nam: plan_nam,
                    breakfast: breakfast,
                    lunch: lunch,
                    dinner: dinner,
                    snack: snack
                })
            })
            .then(response => response.json())
            .then(result => {
                
                show.style.display = 'block';
                title.style.display = 'none';
                document.querySelector('.chartBox').style.display = 'none';
                trackForm.style.display = 'none';

                msg(result.message, 'alert-success' , msg2)

                const content = `
                        <div class="row">
                            <p class="col-12 info-text"><strong>Date: </strong><span>${result.date}</span></p>
                            <p class="col-12 info-text"><strong>Plan Name: </strong><span class="text-success">${plan_nam}</span></p>
                            <p class="col-12 mb-5 border-bottom pb-4 info-text"><strong>Consumed Calories: </strong><span>${consumed_cal} kcal</span></p>
                            <br/>
                            <p class="col-md-12 col-lg-6 info-text line"><strong>Breakfast: </strong><span>${breakfast}</span></p>
                            <p class="col-md-12 col-lg-6 info-text"><strong>Lunch: </strong><span>${lunch}</span></p>      
                            <p class="col-md-12 col-lg-6 info-text"><strong>Dinner: </strong><span>${dinner}</span></p> 
                            <p class="col-md-12 col-lg-6 info-text"><strong>Snack: </strong><span>${snack}</span></p> 
                            <div class="col-12 mt-3">
                                <input type="button" class="edit-2 btn btn-success btn-sm" value="Reset">
                                <a type="button" class="my_diaries btn btn-success btn-sm" href="/history_page">Go to my diaries</a>
                            </div>
                        </div>
                    `
                create_element(content, show)

                document.querySelector('.edit-2').onclick = function(){
                    location.replace("/diary")
                }
            })

        }
        e.preventDefault()
    })


    // Show History
    const history = document.querySelector('.history');
    const chosen = document.querySelector('.chosen');
    let date = document.querySelector("#date");

    fetch('/all_history')
    .then(response => response.json())
    .then(result => {
        result.cal_history.forEach(el => {

            const element = document.createElement('a');

            element.innerHTML = `${el.date}`

            element.type = 'button'
            element.classList = 'showBt col-sm-12 col-md-12 col-lg-2 btn btn-outline-success m-4';
            element.setAttribute('id', `${el.id}`);

            history && history.appendChild(element);  
        })
    })
   

    history && (history.onclick = function(e){
        if (e.target.classList[0] == 'showBt'){
            
            fetch(`/one_history/${e.target.id}`)
            .then(response => response.json())
            .then(result => {

                historyPage.style.display = 'none'
                one_history.style.display = 'block'

                one_history.innerHTML = `
                    <div class="row mt-3">
                        <p class="col-12 info-text"><strong>Date: </strong><span>${result.date}</span></p>
                        <p class="col-12 info-text"><strong>Plan Name: </strong><span class="h6 text-success">${result.plan_nam}</span></p>
                        <p class="col-12 mb-5 border-bottom pb-4 info-text"><strong>Consumed Calories: </strong><span>${result.cal_left} kcal</span></p>
                        <br/>
                        <p class="col-md-12 col-lg-6 info-text line"><strong>Breakfast: </strong><span>${result.breakfast}</span></p>
                        <p class="col-md-12 col-lg-6 info-text"><strong>Lunch: </strong><span>${result.lunch}</span></p>      
                        <p class="col-md-12 col-lg-6 info-text"><strong>Dinner: </strong><span>${result.dinner}</span></p> 
                        <p class="col-md-12 col-lg-6 info-text"><strong>Snack: </strong><span>${result.snack}</span></p> 
                        <div class="col-12 mt-3">
                            <input type="button" class="back-1 btn btn-success btn-sm" value="Back">
                        </div>
                    </div>
                    `
                document.querySelector('.back-1').onclick = function(){
                    historyPage.style.display = 'block';
                    one_history.style.display = 'none';
                }
            })
        }
    })


    date && (date.onchange = function(e) {
        document.querySelector('.error').style.display = 'none'
        fetch(`/history/${date.value}`)
        .then(response => response.json())
        .then(result => {
            history.style.display = 'none'
            pick.style.display = 'none'
            back2.style.display = 'block';
            chosen.style.display = 'block';
            
            const element = document.createElement('a');
            element.innerHTML = `${result.date}`
            
            element.type = 'button'
            element.classList = 'showBt col-sm-12 col-md-12 col-lg-2 btn btn-outline-success';
            element.setAttribute('id', `${result.id}`);
            
            chosen.appendChild(element)
            
            if (chosen.children[1]){
                chosen.children[0].remove()
            }
        })
        .catch(error => {
            document.querySelector('.error').style.display = 'block';
            document.querySelector('.error').innerHTML = '<div class="mb-3 text-danger">Request history is not recorded!</div>';
        })

        e.preventDefault()
    })


    chosen && (chosen.onclick = function(e){
        if (e.target.classList[0] == 'showBt'){
            
            fetch(`/one_history/${e.target.id}`)
            .then(response => response.json())
            .then(result => {
                historyPage.style.display = 'none'
                one_history.style.display = 'block'

                one_history.innerHTML = `
                    <div class="row mt-3">
                        <p class="col-12 info-text"><strong>Date: </strong><span>${result.date}</span></p>
                        <p class="col-12 info-text"><strong>Plan Name: </strong><span class="h6 text-success">${result.plan_nam}</span></p>
                        <p class="col-12 mb-5 border-bottom pb-4 info-text"><strong>Consumed Calories: </strong><span>${result.cal_left} kcal</span></p>
                        <br/>
                        <p class="col-md-12 col-lg-6 info-text line"><strong>Breakfast: </strong><span>${result.breakfast}</span></p>
                        <p class="col-md-12 col-lg-6 info-text"><strong>Lunch: </strong><span>${result.lunch}</span></p>      
                        <p class="col-md-12 col-lg-6 info-text"><strong>Dinner: </strong><span>${result.dinner}</span></p> 
                        <p class="col-md-12 col-lg-6 info-text"><strong>Snack: </strong><span>${result.snack}</span></p> 
                        <div class="col-12 mt-3">
                            <input type="button" class="back btn btn-success btn-sm" value="Back">
                        </div>
                    </div>
                    `
                    document.querySelector('.back').onclick = function(){
                        one_history.style.display = 'none';
                        historyPage.style.display = 'block';
                    }
            })
        }
    })
    

    back2 && (back2.onclick = function(){
        history.style.display = 'block';
        pick.style.display = 'block';
        back2.style.display = 'none';
        chosen.style.display = 'none';
    })


    function create_element(content, place) {
        const div = document.createElement('div');
        div.innerHTML = content 
        place.appendChild(div);
    }


    function msg(msg, cls, place) {
        const message = document.createElement('p');
        message.innerHTML = msg;
        message.classList = `alert ${cls}`;
        place.appendChild(message);
        setTimeout(function () {
            place.style.display = 'none'} , 2000);
    }
    
})
