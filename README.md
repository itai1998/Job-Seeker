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
Working on it. Will be edited later

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

### Add preferred job
If the user select "Add preferred job", the program will list the departments from BYU with their Site ID and prompt the user to choose which deparment they are interested in by entering the Side ID. 

![1](https://user-images.githubusercontent.com/107719287/211649644-4ee5719e-b795-4f96-8c9c-a98f372488b0.png)
