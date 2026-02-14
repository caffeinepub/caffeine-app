import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type CaffeineEntry = {
    id : Nat;
    drinkName : Text;
    amountMg : Nat;
    consumptionTime : Nat;
  };

  public type CaffeinePreset = {
    id : Nat;
    drinkName : Text;
    defaultAmountMg : Nat;
  };

  public type UserSettings = {
    dailyLimitMg : Nat;
  };

  public type UserData = {
    entries : [CaffeineEntry];
    presets : [CaffeinePreset];
    settings : UserSettings;
  };

  public type UserProfile = {
    name : Text;
  };

  let userDataMap = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper Functions
  func ensureUserData(caller : Principal) : UserData {
    switch (userDataMap.get(caller)) {
      case (null) {
        let defaultData : UserData = {
          entries = [];
          presets = [];
          settings = { dailyLimitMg = 400 };
        };
        userDataMap.add(caller, defaultData);
        defaultData;
      };
      case (?data) { data };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Entries Management
  public shared ({ caller }) func addCaffeineEntry(drinkName : Text, amountMg : Nat, consumptionTime : Nat) : async CaffeineEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add entries");
    };

    let userData = ensureUserData(caller);
    let newId = userData.entries.size() + 1;

    let newEntry : CaffeineEntry = {
      id = newId;
      drinkName;
      amountMg;
      consumptionTime;
    };

    let updatedEntries = userData.entries.concat([newEntry]);
    let updatedData : UserData = {
      entries = updatedEntries;
      presets = userData.presets;
      settings = userData.settings;
    };

    userDataMap.add(caller, updatedData);
    newEntry;
  };

  public shared ({ caller }) func deleteCaffeineEntry(entryId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete entries");
    };

    let userData = ensureUserData(caller);
    let filteredEntries = userData.entries.filter(func(entry) { entry.id != entryId });

    if (filteredEntries.size() == userData.entries.size()) {
      return false;
    };

    let updatedData : UserData = {
      entries = filteredEntries;
      presets = userData.presets;
      settings = userData.settings;
    };

    userDataMap.add(caller, updatedData);
    true;
  };

  // Presets Management
  public shared ({ caller }) func addCaffeinePreset(drinkName : Text, defaultAmountMg : Nat) : async CaffeinePreset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add presets");
    };

    let userData = ensureUserData(caller);
    let newId = userData.presets.size() + 1;

    let newPreset : CaffeinePreset = {
      id = newId;
      drinkName;
      defaultAmountMg;
    };

    let updatedPresets = userData.presets.concat([newPreset]);
    let updatedData : UserData = {
      entries = userData.entries;
      presets = updatedPresets;
      settings = userData.settings;
    };

    userDataMap.add(caller, updatedData);
    newPreset;
  };

  public shared ({ caller }) func updateUserSettings(newSettings : UserSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settings");
    };

    let userData = ensureUserData(caller);
    let updatedData : UserData = {
      entries = userData.entries;
      presets = userData.presets;
      settings = newSettings;
    };

    userDataMap.add(caller, updatedData);
  };

  public query ({ caller }) func getUserData() : async UserData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view data");
    };

    ensureUserData(caller);
  };
};
