import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import notifier from "node-notifier";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
const app = express();
var myUsernameAdmin;
var myUsernameStudent;
var addedTeam;
var quizNumber = 1;
var newExistingTeam = null;
var timeHours;
var timeMinutes;
var quizTaken;
var teamResult;
var quizResult;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userWeb");
// console.log(_dirname);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "\\Home\\index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "\\Sign-Up\\sign_in.html");
});
// C:\Users\hp\Downloads\WEBSTER\Avishkar\Home\index.html  

app.get("/signUp", (req, res) => {
  res.sendFile(__dirname + "\\Login\\sign_up.html");
});

const userSchema = {
  FName: String,
  Username: String,
  Mail: String,
  Phone: Number,
  Password: String,
  Profession: String
};

const QuestionSchema = {
  QuizNumber: Number,
  Username: String,
  TeamName: String,
  TimeHours: Number,
  TimeMinutes: Number,
  Id: Number,
  Title: String,
  Content: String,
  TF: String,
  MCQs: String,
  MCQ1: String,
  MCQ2: String,
  MCQ3: String,
  MCQ4: String,
}

const TeamSchema = {
  Name: String,
  Owner: String,
};

const TeamParticipantSchema = {
  Name: String,
  Team: String,
  Owner: String,
};

const QuizNumberSchema = {
  TeamName: String,
  QuizNo: Number,
};

const ResponseSchema = new mongoose.Schema({
  QuizNumber: Number,
  Student: String,
  TeamName: String,
  TimeHours: Number,
  TimeMinutes: Number,
  Id: Number,
  Title: String,
  Content: String,
  TF: String,
  MCQs: String,
});

const ResultSchema = new mongoose.Schema({
  QuizNumber: Number,
  Student: String,
  TeamName: String,
  Id: Number,
  Title: String,
  Content: String,
  TF: String,
  MCQs: String,
});

const AttemptedSchema = new mongoose.Schema({
  QuizNumber: Number,
  Student: String,
  TeamName: String,
});

const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', TeamSchema);
const Question = mongoose.model('Question', QuestionSchema);
const TeamParticipant = mongoose.model('TeamParticipant', TeamParticipantSchema);
const QuizNumber = mongoose.model('QuizNumber', QuizNumberSchema);
const Response = mongoose.model('Response', ResponseSchema);
const Result = mongoose.model('Result', ResultSchema);
const Attempted = mongoose.model('Attempted', AttemptedSchema);
app.post("/signUp",async (req,res) =>{
    const email = req.body.Mail;
    
    try{
    const existingUser = await User.findOne({ Mail: email });
    if (existingUser) {
      notifier.notify({
        title: 'Notification',
        message: 'User with the email already exists.',
      });
    }
    if(req.body.iPassword!=req.body.Password){
      notifier.notify({
        title: 'Notification',
        message: 'Passwords do not match please try again.',
      });
      res.sendFile(__dirname+"\\Login\\sign_up.html");
    }
    else{
      const newUser = new User({
        FName: req.body.FName,
      Username: req.body.Username,
      Mail: req.body.Mail,
      Phone: req.body.Phone,
      Password: req.body.Password,
      Profession: req.body.Profession
    });
    newUser.save();
    res.sendFile(__dirname+"\\Home\\index.html");
  } 
}
catch (error) {
  // Handle errors that occur during the asynchronous operations
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
}
);
app.get("/Admin", (req, res) => {
  console.log(myUsernameAdmin);
  Team.find({Owner: myUsernameAdmin})
        .then(docs=>{
    
          res.render(__dirname + "\\views\\home.ejs", {
            MyUsername: myUsernameAdmin,
            teams: docs,
          });
          console.log(docs);
        })});
        
        
        app.post("/login", (req, res) => {
          const mail = req.body.Mail;
  // console.log(mail);
  const password = req.body.Password;
  // console.log(req.body);
  User.findOne({ Mail: mail })
  .then((docs) => {
    //  console.log(docs);
    
    if (docs) {
        if (docs.Password === password && docs.Profession === "Teacher") {
          myUsernameAdmin = docs.Username;
          res.redirect("/Admin");
        }
        else if (docs.Password === password && docs.Profession === "Student") {
          myUsernameStudent = docs.Username;
          res.redirect("/Student");
        }
        else {
          notifier.notify({
            title: 'Notification',
            message: 'Wrong Password !',
          });
        }
      }
      else {
        notifier.notify({
          title: 'Notification',
          message: 'Email Id not found , please register',
        });
        res.sendFile(__dirname + "\\Home\\index.html");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  });

app.get("/Admin", (req, res) => {
  console.log(myUsernameAdmin);
  Team.find({Owner: myUsernameAdmin})
        .then(docs=>{
    
          res.render(__dirname + "\\views\\home.ejs", {
            MyUsername: myUsernameAdmin,
            teams: docs,
          });
          console.log(docs);
        })});
        
        
        app.post("/login", (req, res) => {
          const mail = req.body.Mail;
  // console.log(mail);
  const password = req.body.Password;
  // console.log(req.body);
  User.findOne({ Mail: mail })
  .then((docs) => {
    //  console.log(docs);
    
    if (docs) {
        if (docs.Password === password && docs.Profession === "Teacher") {
          myUsernameAdmin = docs.Username;
          res.redirect("/Admin");
        }
        else if (docs.Password === password && docs.Profession === "Student") {
          myUsernameStudent = docs.Username;
          res.redirect("/Student");
        }
        else {
          notifier.notify({
            title: 'Notification',
            message: 'Wrong Password !',
          });
        }
      }
      else {
        notifier.notify({
          title: 'Notification',
          message: 'Email Id not found , please register',
        });
        res.sendFile(__dirname + "\\Home\\index.html");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  });
  
  app.get("/createQuiz", (req, res) => {
    res.redirect("/Admin/createQuiz");
  });
  
  const API_URL = "http://localhost:4000";
  app.use(express.static("public"));
  app.use(bodyParser.json());
  
  // Route to render the main page
  app.get("/Admin/createQuiz", async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      if (newExistingTeam === null) {
        notifier.notify({
          title: 'Notification',
          message: 'Please add team first and set time also!',
        });
    }
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/Admin/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Question", submit: "Create Question" });
});

app.get("/Admin/Time", (req, res) => {
  console.log(req.body);
  res.render("time.ejs");
});

app.post("/Admin/Time", (req, res) => {
  console.log(req.body);
  timeHours = req.body.hours;
  timeMinutes = req.body.minutes;
  res.redirect("/Admin/createQuiz");
  
});

app.get("/Admin/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    // console.log("/Admin/edit/:id"+response.data);
    res.render("modify.ejs", {
      heading: "Edit Question",
      submit: "Update Question",
      post: response.data,
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

app.get("/Admin/Team", (req, res) => {
  res.render("team.ejs");
});

app.get("/Admin/ExistingTeam", (req, res) => {
  Team.find({ Owner: myUsernameAdmin }).then(function (result, err) {
    if (err) {
      console.error('Error querying the collection:', err);
    }
    if (result) {
      // console.log(myUsernameAdmin);
      res.render("existingTeam.ejs", { teams: result });
    } else {
      console.log('No documents found in the collection.');
    }
  });
});

app.post("/Student/AddedTeams/Quiz/:i", async (req, res) => {
  try {
    const docs = await Question.find({ TeamName: addedTeam, QuizNumber: quizTaken });
    var idx = 0;
    for (const doc of docs) {
      let newResponse;

      if (doc.Content != null) {
        newResponse = new Response({
          QuizNumber: doc.QuizNumber,
          Student: myUsernameStudent,
          TeamName: doc.TeamName,
          TimeHours: doc.TimeHours,
          TimeMinutes: doc.TimeMinutes,
          Id: doc.Id,
          Title: doc.Title,
          Content: Object.values(req.body)[idx],
          TF: null,
          MCQs: null,
        });
      } else if (doc.TF != null) {
        newResponse = new Response({
          QuizNumber: doc.QuizNumber,
          Student: myUsernameStudent,
          TeamName: doc.TeamName,
          TimeHours: doc.TimeHours,
          TimeMinutes: doc.TimeMinutes,
          Id: doc.Id,
          Title: doc.Title,
          Content: null,
          TF: Object.values(req.body)[idx],
          MCQs: null,
        });
      } else if (doc.MCQs != null) {
        newResponse = new Response({
          QuizNumber: doc.QuizNumber,
          Student: myUsernameStudent,
          TeamName: doc.TeamName,
          TimeHours: doc.TimeHours,
          TimeMinutes: doc.TimeMinutes,
          Id: doc.Id,
          Title: doc.Title,
          Content: null,
          TF: null,
          MCQs: Object.values(req.body)[idx],
        });
      }
      // Check if newResponse is defined before calling save
      if (newResponse) {
        // Save the newResponse to the database
        await newResponse.save();
      }
      idx++;
    }
    // Redirect after the loop has completed and responses are saved
    
    const newAttempted = new Attempted({
      QuizNumber: quizTaken,
      Student: myUsernameStudent,
      TeamName: addedTeam,
    });
    
    newAttempted.save();
    
    
    res.redirect("/Student");
  } catch (error) {
    console.error("Error fetching or saving questions:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/Student", (req, res) => {
  res.sendFile(__dirname + "\\Student\\index.html");
});

app.get("/Student/NewTeam", (req, res) => {
  res.render("joinTeam.ejs");
});

app.get("/Student/AddedTeams", (req, res) => {
  TeamParticipant.find({ Name: myUsernameStudent }).then(function (result, err) {
    if (err) {
      console.error('Error querying the collection:', err);
    }
    if (result) {
      res.render("addedTeams.ejs", { teams: result });
    } else {
      console.log('No documents found in the collection.');
    }
  });
});

var Quizzes;


app.get("/Admin/createQuiz/AddTeam", (req, res) => {
  res.render("addTeam.ejs");
});

app.get("/Student/AddedTeams/Quiz/:i", (req, res) => {
  const i = req.params.i;
  quizTaken = i;
  console.log("i= " + i);
  Question.find({ TeamName: addedTeam, QuizNumber: i })
  .then(Quiz => {
      try {
        res.render("quiz.ejs", { posts: JSON.parse(JSON.stringify(Quiz)), });
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
      }
    })
    .catch(error => {
      console.error('Error finding and sorting quizzes:', error);
    });
  });
  
app.post("/Student/AddedTeams/:team", (req, res) => {
  addedTeam = req.params.team;
  // console.log("addedTeam "+addedTeam);
  Question.findOne({ TeamName: addedTeam })
  .sort({ QuizNumber: -1 })
  .then(sortedQuizzes => {
    res.render("teamQuizzes.ejs", { quizNumber: sortedQuizzes.QuizNumber, teamname: addedTeam });
  })
  .catch(error => {
    console.error('Error finding and sorting quizzes:', error);
    });
  });
  
  app.post("/Admin/ExistingTeam/:team", (req, res) => {
    newExistingTeam = req.params.team;
    QuizNumber.findOne({ TeamName: newExistingTeam })
    .then(lastDocument => {
      if (lastDocument) {
        const update = {
          TeamName: newExistingTeam,
          QuizNo: lastDocument.QuizNo + 1,
        }
        QuizNumber.updateOne({ TeamName: newExistingTeam }, update)
        .then(result => {
          console.log('Document updated successfully:', result);
          })
          .catch(err => {
            console.error('Error updating document:', err);
          })
          quizNumber = lastDocument.QuizNo;
        } else {
          quizNumber = 1;

        const newQuiz = new QuizNumber({
          TeamName: newExistingTeam,
          QuizNo: 1,
        });
        newQuiz.save();
        //  console.log('Last inserted document:', lastDocument);
      }
    })
    res.render("index.ejs");
  });
  
  var newOwner;
  app.post("/Student/NewTeam/submit", async (req, res) => {
    // res.redirect("/Student");
    try {
      // console.log(req.body);
      const newTeam = req.body.textValue;
      Team.findOne({ Name: newTeam })
      .then((docs) => {
        // console.log(docs);
        newOwner = docs.Owner;
        // console.log("newOwner "+newOwner);
      })
      .catch((err) => {
        console.log(err);
      });
    const newTeamParticipant = new TeamParticipant({
      Name: myUsernameStudent,
      Team: req.body.textValue,
      Owner: newOwner,
    });
    newTeamParticipant.save();
    notifier.notify({
      title: 'My Notification',
      message: 'Joined Team Successfuly',
      sound: true, // Plays a sound
      wait: true,  // Wait with the notification until the user closes it
    });
    res.redirect("/Student");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});


// Create a new post
app.post("/Admin/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    const newQuestion = new Question({
      QuizNumber: quizNumber,
      Username: myUsernameAdmin,
      TeamName: newExistingTeam,
      TimeHours: timeHours,
      TimeMinutes: timeMinutes,
      Id: response.data.id,
      Title: response.data.title,
      Content: response.data.content,
      MCQs: response.data.mcq,
      TF: response.data.tf,
      MCQ1: response.data.mcq1,
      MCQ2: response.data.mcq2,
      MCQ3: response.data.mcq3,
      MCQ4: response.data.mcq4
    });
    newQuestion.save();
    res.redirect("/Admin/createQuiz");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.post("/Admin/newTeam", async (req, res) => {
  try {
    const teamName = req.body.textValue;
    const _existingTeam = await Team.findOne({Name: teamName});
    if(_existingTeam){
      notifier.notify({
        title: 'My Notification',
        message: 'Team already exists',
        sound: true, 
        wait: true,  
      });
      res.redirect("/Admin/Team");
    }
    else{
      console.log(req.body);
      const newTeam = new Team({
        Name: req.body.textValue,
      Owner: myUsernameAdmin,
    });
    newTeam.save();
    newExistingTeam = req.body.textValue;
    
    QuizNumber.findOne({ TeamName: newExistingTeam })
    .then(lastDocument => {
        if (lastDocument) {
          const update = {
            TeamName: newExistingTeam,
            QuizNo: lastDocument.QuizNo + 1,
          }
          QuizNumber.updateOne({ TeamName: newExistingTeam }, update)
          .then(result => {
              console.log('Document updated successfully:', result);
            })
            .catch(err => {
              console.error('Error updating document:', err);
            })
            quizNumber = lastDocument.QuizNo;
        } else {
          quizNumber = 1;
          
          const newQuiz = new QuizNumber({
            TeamName: newExistingTeam,
            QuizNo: 1,
          });
          newQuiz.save();
        }
      })
      .catch(err => {
        console.error('Error finding the last inserted document:', err);
      })
      notifier.notify({
        title: 'My Notification',
        message: 'Team created successfuly',
        sound: true, // Plays a sound
        wait: true,  // Wait with the notification until the user closes it
      });
      res.redirect("/Admin/createQuiz");
    } }
    catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  });
// Partially update a post
app.post("/Admin/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`, req.body);
      console.log("/Admin/api/posts/:id");
      
      const filter = { Username: myUsernameAdmin, Id: response.data.id };
      const update = {
        QuizNumber: quizNumber,
      Username: myUsernameAdmin,
      TeamName: newExistingTeam,
      TimeHours: timeHours,
      TimeMinutes: timeMinutes,
      Title: response.data.title,
      MCQs: response.data.mcq,
      TF: response.data.tf,
      Content: response.data.content,
      Id: response.data.id,
      MCQ1: response.data.mcq1,
      MCQ2: response.data.mcq2,
      MCQ3: response.data.mcq3,
      MCQ4: response.data.mcq4
    };
    
    // Use updateOne to update the document
    Question.updateOne(filter, update)
    .then(result => {
      console.log('Document updated successfully:', result);
    })
    .catch(err => {
      console.error('Error updating document:', err);
    })
    
    res.redirect("/Admin/createQuiz");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
});

// Delete a post
app.get("/Admin/api/posts/delete/:id", async (req, res) => {
  try {
    const filter = { Username: myUsernameAdmin, Id: req.params.id };
    
    Question.deleteOne(filter)
    .then(result => {
      console.log('Document deleted successfully:', result);
    })
    .catch(err => {
        console.error('Error deleting document:', err);
      })
      
      res.redirect("/Admin/createQuiz");
      await axios.delete(`${API_URL}/posts/${req.params.id}`);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting post" });
    }
  });

  // submit posts
  app.get("/Admin/createQuiz/submit", async (req, res) => {
    res.render(__dirname + "\\views\\home.ejs", { MyUsername: myUsernameAdmin });
});

app.get("/Student/result", (req, res) => {
  Attempted.find({ Student: myUsernameStudent })
  .then(docs => {
      res.render("attemptedTeams.ejs",
      { teams: docs });
    });
});

app.post("/Student/Attempted/:team", (req, res) => {
  Attempted.find({ Student: myUsernameStudent, TeamName: req.params.team })
    .then(docs => {
      teamResult = req.params.team;
      res.render("attemptedQuizzes.ejs",
      { teams: docs });
    });
  });
   const querySchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Message: String,
  });
  const Query = mongoose.model('Query',querySchema);
  app.get("/contactUs",(req,res)=>{
    res.sendFile(__dirname+"\\Home\\contact_us.html");
  });
  app.post("/contactUs",(req,res)=>{
    const newQueryUser = new Query({
      Name: req.body.Name,
      Email: req.body.Email,
      Message: req.body.Message,
    });
    newQueryUser.save();
    notifier.notify({
      title: 'Notification',
      message: 'Query Succesfully Saved',
    });
    res.sendFile(__dirname+"\\Home\\contact_us.html");
  });
  
  app.post("/Student/Attempted/Result/Quiz/:id", (req, res) => {
    var length;
    var responses;
    var answers;
    Response.find({Student:myUsernameStudent,TeamName:teamResult,QuizNumber:quizResult})
    .then(docs=>{
      const id=docs.Id;
      Question.findOne({TeamName:teamResult,QuizNumber:quizResult,Id: id})
      .then(answer=>{
       if(answer.TF===docs.TF && answer.Content===docs.Content && answer.MCQs===docs.MCQs){
        const newResult = new Result({
        QuizNumber: answer.QuizNumber,
        Student: myUsernameStudent,
        TeamName: teamResult,
        Id: id,
        Title: answer.Title,
        Content:answer.Content,
        TF:answer.TF,
        MCQs:answer.MCQs,
        });
        newResult.save();
       }
       else {
        const newResult = new Result({
        QuizNumber: answer.QuizNumber,
        Student: myUsernameStudent,
        TeamName: teamResult,
        Id: id,
        Title: answer.Title,
        Content:docs.Content,
        TF:docs.TF,
        MCQs:docs.MCQs,
        });
        newResult.save();
       }
      });
    });
    
      Result.find({ Student: myUsernameStudent, TeamName: teamResult, QuizNumber: req.params.id })
        .then(docs => {
          quizResult = req.params.id;
          res.render("result.ejs",
            { teams: docs });
        });
    });
    
  app.listen(port, () => {
    console.log(`Listening at port ${port}`);
  });
