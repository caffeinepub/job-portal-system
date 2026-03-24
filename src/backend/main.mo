import Principal "mo:core/Principal";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Custom Types
  type JobSeekerProfile = {
    name : Text;
    bio : Text;
    skills : [Text];
    experience : [Text];
  };

  type EmployerProfile = {
    name : Text;
    bio : Text;
    company : Text;
    industry : Text;
  };

  type UserRole = {
    #job_seeker;
    #employer;
  };

  type UserProfile = {
    role : UserRole;
    jobSeekerProfile : ?JobSeekerProfile;
    employerProfile : ?EmployerProfile;
  };

  module UserProfile {
    public func compare(user1 : UserProfile, user2 : UserProfile) : Order.Order {
      let name1 = switch (user1.jobSeekerProfile) {
        case (?js) { js.name };
        case (null) {
          switch (user1.employerProfile) {
            case (?emp) { emp.name };
            case (null) { "" };
          };
        };
      };
      let name2 = switch (user2.jobSeekerProfile) {
        case (?js) { js.name };
        case (null) {
          switch (user2.employerProfile) {
            case (?emp) { emp.name };
            case (null) { "" };
          };
        };
      };
      Text.compare(name1, name2);
    };
  };

  type JobListing = {
    id : Nat;
    title : Text;
    company : Text;
    location : Text;
    description : Text;
    salary : Text;
    category : Text;
    postedBy : Principal;
    postedAt : Time.Time;
  };

  type ApplicationStatus = {
    #pending;
    #reviewed;
    #accepted;
    #rejected;
  };

  type JobApplication = {
    id : Nat;
    jobId : Nat;
    applicant : Principal;
    coverLetter : Text;
    status : ApplicationStatus;
    appliedAt : Time.Time;
  };

  // Persistent Data
  var nextJobId = 1;
  var nextApplicationId = 1;

  let jobs = Map.empty<Nat, JobListing>();
  let applications = Map.empty<Nat, JobApplication>();
  let users = Map.empty<Principal, UserProfile>();

  // Required Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  // Profile Management
  public shared ({ caller }) func createJobSeekerProfile(name : Text, bio : Text, skills : [Text], experience : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile : UserProfile = {
      role = #job_seeker;
      jobSeekerProfile = ?{ name; bio; skills; experience };
      employerProfile = null;
    };
    users.add(caller, profile);
  };

  public shared ({ caller }) func createEmployerProfile(name : Text, bio : Text, company : Text, industry : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile : UserProfile = {
      role = #employer;
      jobSeekerProfile = null;
      employerProfile = ?{ name; bio; company; industry };
    };
    users.add(caller, profile);
  };

  // Job Management
  public shared ({ caller }) func postJob(title : Text, company : Text, location : Text, description : Text, salary : Text, category : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post jobs");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        switch (profile.role) {
          case (#employer) {
            let jobId = nextJobId;
            nextJobId += 1;
            let job : JobListing = {
              id = jobId;
              title;
              company;
              location;
              description;
              salary;
              category;
              postedBy = caller;
              postedAt = Time.now();
            };
            jobs.add(jobId, job);
            jobId;
          };
          case (#job_seeker) { Runtime.trap("Only employers can post jobs") };
        };
      };
    };
  };

  public query func getJobsByTitle(title : Text) : async [JobListing] {
    jobs.values().toArray().filter(func(j) { j.title.contains(#text title) });
  };

  public query func getJobsByCompany(company : Text) : async [JobListing] {
    jobs.values().toArray().filter(func(j) { j.company.contains(#text company) });
  };

  public query func getJobsByLocation(location : Text) : async [JobListing] {
    jobs.values().toArray().filter(func(j) { j.location.contains(#text location) });
  };

  public query func getJobsByCategory(category : Text) : async [JobListing] {
    jobs.values().toArray().filter(func(j) { j.category.contains(#text category) });
  };

  public query func getAllJobs() : async [JobListing] {
    jobs.values().toArray().sort();
  };

  module JobListing {
    public func compare(job1 : JobListing, job2 : JobListing) : Order.Order {
      Nat.compare(job1.id, job2.id);
    };
  };

  public shared ({ caller }) func updateJob(jobId : Nat, title : Text, company : Text, location : Text, description : Text, salary : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update jobs");
    };
    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.postedBy != caller) { Runtime.trap("Only the job owner can update this job") };
        let updatedJob : JobListing = {
          job with
          title;
          company;
          location;
          description;
          salary;
          category;
        };
        jobs.add(jobId, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteJob(jobId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete jobs");
    };
    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.postedBy != caller) { Runtime.trap("Only the job owner can delete this job") };
        jobs.remove(jobId);
      };
    };
  };

  // Application Management
  public shared ({ caller }) func applyToJob(jobId : Nat, coverLetter : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply to jobs");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        switch (profile.role) {
          case (#job_seeker) {
            applications.values().forEach(
              func(existingApplication) {
                if (existingApplication.jobId == jobId and existingApplication.applicant == caller) {
                  Runtime.trap("You have already applied for this job");
                };
              }
            );
            let applicationId = nextApplicationId;
            nextApplicationId += 1;
            let application : JobApplication = {
              id = applicationId;
              jobId;
              applicant = caller;
              coverLetter;
              status = #pending;
              appliedAt = Time.now();
            };
            applications.add(applicationId, application);
            applicationId;
          };
          case (#employer) { Runtime.trap("Employers cannot apply to jobs") };
        };
      };
    };
  };

  public query ({ caller }) func getApplicationsByJob(jobId : Nat) : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };
    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.postedBy != caller) {
          Runtime.trap("Only the job owner can view applications for this job");
        };
        applications.values().toArray().filter(func(a) { a.jobId == jobId });
      };
    };
  };

  public query ({ caller }) func getApplicationsByApplicant(applicant : Principal) : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };
    if (caller != applicant and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own applications");
    };
    applications.values().toArray().filter(func(a) { a.applicant == applicant });
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : Nat, status : ApplicationStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update application status");
    };
    switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        switch (jobs.get(application.jobId)) {
          case (null) { Runtime.trap("Job not found") };
          case (?job) {
            if (job.postedBy != caller) {
              Runtime.trap("Only the job owner can update this application status");
            };
            let updatedApplication = { application with status };
            applications.add(applicationId, updatedApplication);
          };
        };
      };
    };
  };

  public query ({ caller }) func getApplicationStatus(applicationId : Nat) : async ApplicationStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view application status");
    };
    switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        if (application.applicant != caller) {
          switch (jobs.get(application.jobId)) {
            case (null) { Runtime.trap("Job not found") };
            case (?job) {
              if (job.postedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
                Runtime.trap("Unauthorized: Can only view status of your own applications or applications to your jobs");
              };
            };
          };
        };
        application.status;
      };
    };
  };
};
