function send_email(emails, subject, text)
{
  MailApp.sendEmail(emails, subject, text)
  Logger.log("Notification Sent to: " + emails)
}

function date_in_past(date)
{
      var today = new Date();
      today.setHours(0,0,0,0) 
      var new_date = new Date(date)
      new_date.setHours(0,0,0,0)

      var today_unix = today.valueOf()
      var date_unix = new_date.valueOf()

      if(date_unix < today_unix)
        return true
      else
        return false
}

function print(text)
{
  Logger.log(text)
}

function convert_date(input_date)
{
  var output_format = "yyyy-MM-dd";
  var formatted_date = Utilities.formatDate(input_date, "GMT-4", output_format);

  return formatted_date;
}

function check_if_calendar_event_exists(calendar, start_time, end_time, title)
{
    var existingEvents = calendar.getEvents(start_time, end_time, { search: title });
    if(existingEvents.length > 0)
      return false;
    else
      return true;
}

function get_emails(spreadsheet, emergency)
{
  var notification_list = spreadsheet.getRange(3,1, spreadsheet.getLastRow(), 1).getValues().filter(String);
  var emergency_list = spreadsheet.getRange(3,2, spreadsheet.getLastRow(), 1).getValues().filter(String);
  var email_list = "";
  for(var i=0; i<notification_list.length; i++)
    {
      email_list = email_list + notification_list[i].toString() + ","      
    }
  if(emergency)
  {
    for(var j=0; i<emergency_list.length; j++)
    {
      email_list = email_list + emergency_list[j].toString() + ","      
    }
  }

  return [email_list, notification_list];
}


function send_watering_alert(configuration)
{
  var[addresses, _] = get_emails(configuration, true)
  MailApp.sendEmail(addresses, "Mice Are Not Watered!", "The mice were not reported as watered today. Can everyone check that they have been watered?")
}