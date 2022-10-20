## HealthyPlan


## This is a project for CS50's web programming with Python and JS.

### [CS50 final project Demo Video](https://youtu.be/xRZrpdQO-Hw)


### Overview:

HealthyPlan is a web application that allows users to see different plans, every plan offers several meals with recipes for breakfast, lunch, dinner, and snack.

After registering and creating an account by a user, in the user’s profile, s/he is asked to enter some information like weight, height, gender, and target, and then they have the possibility to choose a plan. 

Based on the entered information, the application provides them with a report regarding daily calorie intake and BMI/Health status. This application uses information like gender and target to calculate the daily calorie intake, and information like weight and height to calculate the BMI/Health status.

Users will have access to their own plan of choice, and they can track the number of daily calories and the meals they have consumed. This application also provides a ‘History’ option (My Diaries), where users can select the desired date and then have access to all information of the previous days such as consumed calories, and meals.


### Distinctiveness and Complexity:

This project is a web application that is completely different from an e-commerce site that deals with selling or auctioning products like project 2 which we were able to put our products for sale and receive different suggested prices from other users and determine the winner and make the winner aware of his/her win. It is also not similar to a social network application in project 4 that deals with sharing posts and following other users and commenting under them, and making our favorite comments or posts liked, or any other projects that I worked on in this course. 

According to the explanations mentioned in the overview section, it is clear that the usage and functionality of this web application are unique and are introducing a virtual dietitian that with its help, user can reach his/her best weight according to the calculated elements. Below I will explain more about the technical stuff and its complexity.

For the data used in the application, such as in the plans (containing meals, recipes, and calories), I used a JSON file as a source of data to be consumed by the API endpoints, and it has been also connected with the Plan model in the database, in different parts of the JS file, the fetch methods are using the JSON file's data to show on the intended pages of the application.

In order to get the required user information, there is a form in the user's profile that receives the information from the user, and this information using javascript is sent to the backend and saved as a Profile model that is defined in ‘model.py’, also there are some calculations and condition before submitting the form in javascript part that in the case of lacking the required conditions, it throws an error to the user. This information can be edited by using javascript, this information (Profile model) are being calculated in the backend (views.py) and then represented in the user's profile, such as recommended daily calories, BMI, and health status.  On the same page, there are two buttons, one takes the user to the page showing the desired plan of the choice with all recipes, and the other one takes the user to the page named Calorie Tracker(diary.html).

In diary.html, there is another form in which we can select our daily consumed meals of the plan of our choice and there is a counter which is able to count daily consumed calories while selecting every field (breakfast, lunch, dinner, snack). By using javascript the counter will calculate and change the number to show the remaining calories in real-time, which was kind of challenging to make the look and the calculation work. For the functionality and styling of the counter, I used the doughnut chart js library. To have more coordination between the counter and the chart, the chart is passed some variables related to the counter. For submitting the form, it is defined the condition that all fields should be selected otherwise it can't be submitted and throws an error. After submitting this form, the information of this page such as consumed calories, name of the choice plan, and the selected meals will be sent to the backend through javascript and the date comes from datetime module in the backend part (views.py) for the current date, then all these data saved as a Track_cal model (defined in model.py), this information and the meals can be edited as well, but just on the same day.

On ‘My Diaries’ page (history_page.html), by using javascript, the data is being fetched from ('/all_history') API path and showed all built Track_cal objects by the user (on the Calorie Tracker page ‘diary.html’) from the Track_cal model (in model.py) on ‘My Diaries’ page. By choosing each of these objects, it is fetched the 'id' of the selected object into ('/one_history/<int:id>') API path and it can show the selected object contains the date, consumed calories, name of the choice plan and the selected meals.

I also put a date input as a date picker, whenever the user considers a specific date, s/he can pick it, and by using javascript and 'onchange' method, the date can be fetched and find the Track_cal object that is only built by the same user and its date is matched with the considered date and then it shows its information (date, consumed calories, name of the choice plan, and the selected meals), and if it does not find any object that its date is matched with the considered date, it throws an error message ‘Request history is not recorded!’ which is created in the JS file.

To style the different elements and pages of this web application, I have used both Bootstrap and CSS, and all of the pages are fully responsive on mobile screen sizes. For making the application responsive, I tried to use the defined grid and flex in bootstrap as much as I can and also media queries in the CSS stylesheet.

It is necessary to mention, in addition to all the aforementioned step-by-step explanations, this project was very challenging for me in regard to putting everything from the idea on the paper into practice, and also thinking about the architecture of the application, from data flows and their relations, to how to make the application as smooth and as user friendly as possible (UI/UX), I enjoyed this challenge very much and I've learned a lot out of it.

Thank you for all CS50!


### Project Structure & Files content:

* final: main application directory.
	* static/final: contains all static content.
		* styles.css: contains all styles used in the project.
       	* index.js: contains all JavaScript used in the project and some pages like:
			* Single meal: contains meal's image, its title, calorie and recipe.
			* Single History: contains number of daily calories and the meals that the user consumed.
		* images: contains all images used in project.
	* templates/final: contains all application templates.
		* layout.html: base template that all other tempalates extend it, containing Navbar and Footer.
		* index.html: template that shows four diet plans.
		* plan.html: template that shows a single plan (contains three meals for breakfast, three meals for lunch, three meals for dinner, and three meals for snack).
		* my_profile.html: template that shows profile form.
		* report.html: template that shows personal information and profile report of the user and edit form.
		* diary.html: template contains a calorie counter and a form where we can choose the meals of our desired plan daily.
		* history_page.html: template that shows all information of the previous days.	
		* login.html: template that shows login form.
		* register.html: template that shows registration form.
	* models.py: contains four models I used in the project. UserExtended model extends the standard User model, Plan model is for the plans, and Profile model represents users' profile       consisting of weight, height, gender, target and user's desired plan and Track_cal model is for tracking consumed daily calories and meals.
	* admin.py: I added admin classes and registered User model.
	* urls.py: all application URLs.
	* views.py: contains all application views.
	* mydata.json: I made this json file containing all plans consisting of all the meal titles and their calories, recipes, and image addresses.


### Technology Used & Features:

* Python
* JavaScript
* Json 
* API endpoints
* SQLite
* Html 
* Css
* Bootstrap
* Mobile Responsive


### How to run:

* Run following commands to migrate database:
	- python manage.py makemigrations
	- python manage.py migrate

* You can run this command to run your server:
	- python manage.py runserver
