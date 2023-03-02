# BYU Job Seeker
BYU Job Seeker is a Node.js program that allows the students at BYU to find their desired job on campus by selecting the departments and job categories. The job title and description links will be saved into the table after the students choose the job, so they can later view their job choices. The students can remove the job from the table if they wish.

# APIs
This program uses the following APIs:
1. Person v3
2. Job_Openings v1 (all the sites)
3. Job_Openings v1 (job families specified)
4. Job_Openings v1 (specified job families)

# User Guide
## Setting Up the Program
### 1) Amazon Web Service
Log on to AWS services and navigate to the BYU AWS Store

![1](https://user-images.githubusercontent.com/107719287/212414786-2c4c0539-b121-428e-8ce9-5cc9dba9dfd9.png)

Under PowerUser, select Command line or programmatic access, then select PowerShell at the top.
Copy Option 1

![1](https://user-images.githubusercontent.com/107719287/212415185-d32632c9-7b13-4969-96fe-bbae80c21619.png)

Paste your AWS Credentials into the command line of your CLI Move on to step 2) Installation

### 2) Installation
1. Clone this repository
- Open the command terminal
- Navigate to the file using these commands:
    - **git clone** [https://github.com/byu-oit-training/whimple-technical-challenge.git](https://github.com/byu-oit-training/I-Tai-technical-challenge.git)
    - **cd I-Tai-technical-challenge**
 2. Install necessary packages:
    - type into the terminal **npm install**
 3. Enter AWS Credentials into terminal
    - See above for how to get AWS Credentials
 4. Navigate to the folder in your file explorer containing your project and unzip the db file.
 5. Open the Docker Desktop program on your computer
 6. Wait 5-10 seconds, or until docker says its running.
 7. Type Docker-compose up -d into the terminal
 8. Wait 5-10 seconds, or until both databases say they are running.
 9. Execute program:
    - type in to the terminal node main.js

### 3) Adding/Updating the token
- You would need to update the token every hour in order to run the program. Find token.js and paste the valid token.  

![1](https://user-images.githubusercontent.com/107719287/213271357-1c33c111-328a-43db-8e16-3f8a3499cd46.png)

## Run the program
The program will first test if AWS successfully connects to the darker database. After the verification is successful, the program will ask the users to enter their BYU ID.

![1](https://user-images.githubusercontent.com/107719287/211399767-6be04f76-825b-4d3c-b578-8f46416fee6e.png)

The program will then show the user's name according to BYU ID. The user will be verified that the given name is corrected or not.

![1](https://user-images.githubusercontent.com/107719287/211405123-cd1a03bc-40f8-4224-a1f1-028aa80b927d.png)

Upon validation, the main menu will be displayed with a welcome message and the introduction of BYU Job Seeker.
The user can select what actions they want to take from the four options below:
1. Add preferred job
2. Delete specific job
3. Delete all jobs
4. Exit

![1](https://user-images.githubusercontent.com/107719287/211644477-05cf0602-f39c-4f23-8e88-415ebc4b148e.png)

### 1. Add preferred job
If the user selects "Add preferred job", the program will list the departments from BYU with their Site ID and prompt the user to select which deparment they are interested in. 

![1](https://user-images.githubusercontent.com/107719287/217347793-fc9e92b3-2726-425b-bfdd-0ef2e87b50dc.PNG)

After selecting the department with its side ID, the program will then list the job category with its title ID of the department that the user choose. Again, the user can tell the program which category they are interested in by selecing the category name with its title ID.

![1](https://user-images.githubusercontent.com/107719287/217348447-728ef0dd-ab3f-40b6-8a0f-8aaba72845b7.PNG)

The program will show all the job openings according to the user's chosen category. The user can select the job they want by selecting the job title.

![1](https://user-images.githubusercontent.com/107719287/211654826-9b773974-7fa2-4a43-be50-df6a962049dd.png)

The selected job will be saved in the table, and the program will return to the menu. 

![1](https://user-images.githubusercontent.com/107719287/217348927-f27e4db5-2586-42a0-877c-b45945526ce1.PNG)

### 2. Delete specific job
The option "Delete specific job" allows the users to remove the job they choose from the table. The job title will be listed, so the users can select the job title to remove the job.

![1](https://user-images.githubusercontent.com/107719287/217349685-6d12c582-64fe-41e6-8807-5ac9a564f158.PNG)

The program will show a message "Successfully deleting the job..." after the user selects the job title. The program will then return to the menu, and the selected job will be removed from the table.

![2](https://user-images.githubusercontent.com/107719287/217349697-26f01cdf-8b07-4312-9f4d-4ac454e166b9.PNG)

### 3.  Delete all preferred jobs
"Delete all preferred jobs" will remove all the preferred jobs that the user selects from the table.
The program will ask the user if they are sure to remove all the selected jobs or not. 

![1](https://user-images.githubusercontent.com/107719287/217350062-36250ee0-9902-423a-9b6a-11c951f7ab32.PNG)

If the user enters "n", the program will return back to the menu and not remove the jobs. But if the user enters "y", the program will remove all the jobs from the table and return to the menu.

![2](https://user-images.githubusercontent.com/107719287/217350069-8f65f313-947d-4d20-a4c6-b461be1c8cc2.PNG)

### 4. Exit
The "Exit" option will let the users leave the program

![1](https://user-images.githubusercontent.com/107719287/211906307-56223138-bef6-40da-9ef7-9a42ceee09c3.png)
