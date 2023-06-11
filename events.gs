function get_resources()
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Signup");
  var configuration_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configuration");
  var calendar = CalendarApp.getCalendarById("d1608edad8e97b4f8ef27f812bdbf2980c2ba1bc308cfc8128ed14a4d54e3138@group.calendar.google.com");

  return [spreadsheet, configuration_sheet, calendar]
}


function main()
{
  var [spreadsheet, configuration_sheet, calendar] = get_resources()

  var [emails, _] = get_emails(configuration_sheet)
  var dates = spreadsheet.getRange(3, 1, spreadsheet.getLastRow()-2, 1).getValues();
  var water_signups = spreadsheet.getRange(3, 2, spreadsheet.getLastRow()-2, 1).getValues();
  var weigh_signups = spreadsheet.getRange(3, 3, spreadsheet.getLastRow()-2, 1).getValues();
  var holder_signups = spreadsheet.getRange(3, 4, spreadsheet.getLastRow()-2, 1).getValues();

  for(var i=0; i<dates.length; i++)
  {
      var date = dates[i];
      if(date_in_past(date))
          {
            continue
          }

      new_date = convert_date(new Date(date));
      
      var water_signee = water_signups[i];
      var weigh_signee = weigh_signups[i];
      var holder_signee = holder_signups[i];
             
      start_time = new Date(new_date+"T15:00:00");
      end_time = new Date(new_date+"T17:30:00");

      check_for_signup(calendar, emails, start_time, end_time, water_signee, 'water', new_date)
      check_for_signup(calendar, emails, start_time, end_time, weigh_signee, 'weigh', new_date)
      check_for_signup(calendar, emails, start_time, end_time, holder_signee, 'holder', new_date)

  }
}


function check_for_signup(calendar, notification_list, start_time, end_time, signee, event, date)
{
  if(signee == 'X')
    {
      Logger.log("Need someone for this event, they will be notified later!")
    }
  else if(signee == "")
    {
      Logger.log("No signup needed for " + event + " on " + date + "!")
    }
  else if(signee.length > 0)
    {
      create_calendar_event(calendar, notification_list, start_time, end_time, signee, event)
    }
}


function check_for_submit()
{
    [sheet, _, _] =  get_resources()
    // Is the edit from the checkbox, if so, see what its state is.
    checkbox = sheet.getRange("H1")
    status = sheet.getRange("I1")
    if(checkbox.isChecked())
    {
        status.setValue("Saving...");
        main();
        checkbox.uncheck();
        status.setValue("");
    }
    else
      print('Not the checkbox, okay to ignore this edit!')
    // If Not, ignore it
}


function send_notifications()
{
  // Get Needed Times
  var today = new Date()
  var tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0,0,0,0)
  today.setHours(0,0,0,0)


  var [spreadsheet, configuration, _] = get_resources()
  var [emails, _] = get_emails(configuration, false)
  var dates = spreadsheet.getRange(3, 1, spreadsheet.getLastRow()-2, 1).getValues();
  var water_signups = spreadsheet.getRange(3, 2, spreadsheet.getLastRow()-2, 1).getValues();
  var weigh_signups = spreadsheet.getRange(3, 3, spreadsheet.getLastRow()-2, 1).getValues();
  var holder_signups = spreadsheet.getRange(3, 4, spreadsheet.getLastRow()-2, 1).getValues();

  for(var i=0; i < dates.length; i++)
    {
      var date = dates[i];
      if(date_in_past(date))
        continue
          

      if(date[0].toString() == today)
      {
          if(water_signups[i] == 'X')
          {
              send_email(emails, 'Husbandry Need!', 'We need someone to water today!')
          }
          if(weigh_signups[i] == 'X')
          {
              send_email(emails, 'Husbandry Need!', 'We need someone to weigh mice today!')
          }
          if(holder_signups[i] == 'X')
          {
              send_email(emails, 'Husbandry Need!', 'We need someone to change dish holders today!')
          }
      }
      
      if(date[0].toString() == tomorrow)
      {

          if(water_signups[i] == 'X')
          {
            send_email(emails, 'Husbandry Need!', 'We need someone to water tomorrow!')
          }
          if(weigh_signups[i] == 'X')
          {
            send_email(emails, 'Husbandry Need!', 'We need someone to weigh mice tomorrow!')
          }
          if(holder_signups[i] == 'X')
          {
            send_email(emails, 'Husbandry Need!', 'We need someone to change dish holders tomorrow!')
          }
      }
    }
}


function create_calendar_event(calendar, guest_list, start_time, end_time, signee, event)
{
    var item_name = signee + " is signed up to " + event;
    if(check_if_calendar_event_exists(calendar, start_time, end_time, item_name))
    {
      calendar.createEvent(item_name, start_time, end_time, {guests: guest_list, sendInvites: true}).setColor("7");
      Logger.log("Creating event: " + item_name)
    }
    else
      Logger.log("Event: \"" + item_name + "\" already exists");
}


function check_that_watering_is_done()
{
  [spreadsheet, configuration, _] = get_resources();

  var today = new Date();
  today.setHours(0,0,0,0);

  var dates = spreadsheet.getRange(3, 1, spreadsheet.getLastRow()-2, 1).getValues();
  var answers = spreadsheet.getRange(3, 5, spreadsheet.getLastRow()-2, 1).getValues();
 

  for(var j=0; j<dates.length; j++)
  {
    if(dates[j].toString() == today.toString())
    {
      if(answers[j].toString() == "No")
      {
        send_watering_alert(configuration); 
      }
      else
        print("Mice were watered today!")
        continue
    }
    else
      continue
  }


}