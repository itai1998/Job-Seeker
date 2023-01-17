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
If the user select "Add preferred job", the program will list the departments from BYU with their Site ID and prompt the user to choose which deparment they are interested in by entering the Side ID. 

![1](https://user-images.githubusercontent.com/107719287/211649644-4ee5719e-b795-4f96-8c9c-a98f372488b0.png)

After entering the Side ID, the category with their Title ID of that department will be listed. Again, the user can tell the program which category they are interested in by entering the Title ID.

![1](https://user-images.githubusercontent.com/107719287/211652486-7205421e-d35f-4309-b416-cc06c996bc50.png)

The program will show all the job openings according to the user's chosen category. The user can select the job they want by selecting the job title.

![1](https://user-images.githubusercontent.com/107719287/211654826-9b773974-7fa2-4a43-be50-df6a962049dd.png)

The selected job will be saved in the table, and the program will return to the menu. 

![1](https://user-images.githubusercontent.com/107719287/211656836-a0468184-8884-46ae-a6b5-050443740c1f.png)

### 2. Delete specific job
The option "Delete specific job" allows the users to remove the job they choose from the table. The job title will be listed, so the users can select the job title to remove the job.

![1](https://user-images.githubusercontent.com/107719287/211901877-a067b430-8f28-437b-9118-8f4e6f612c29.png)

The program will show a message "Successfully deleting the job..." after the user selects the job title. The program will then return to the menu, and the selected job will be removed from the table.

![1](https://user-images.githubusercontent.com/107719287/211902046-c992aebd-22a1-42ae-a2d5-eb8bb742f9e3.png)

### 3.  Delete all preferred jobs
"Delete all preferred jobs" will remove all the preferred jobs that the user selects from the table.
The program will ask the user if they are sure to remove all the selected jobs or not. 

![1](https://user-images.githubusercontent.com/107719287/211903632-4690459f-54ae-4d20-9f7b-23962bcb1c47.png)

If the user enters "n", the program will return back to the menu and not remove the jobs. But if the user enters "y", the program will remove all the jobs from the table and return to the menu.

![1](https://user-images.githubusercontent.com/107719287/211905456-b37fcc9d-a732-4937-b042-e70873f54e20.png)

### 4. Exit
The "Exit" option will let the users leave the program

![1](https://user-images.githubusercontent.com/107719287/211906307-56223138-bef6-40da-9ef7-9a42ceee09c3.png)
