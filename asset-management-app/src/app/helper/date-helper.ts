export class DateHelper {
    static generateCharacterFromDate(): string {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2); // Last two digits of the year
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month, zero-padded
        const day = date.getDate().toString().padStart(2, '0'); // Day of the month, zero-padded
        const hour = date.getHours().toString().padStart(2, '0'); // Hour of the day, zero-padded
        const minute = date.getMinutes().toString().padStart(2, '0'); // Minutes, zero-padded
        const second = date.getSeconds().toString().padStart(2, '0'); // Seconds, zero-padded
      
        const generatedString = year + month + day + hour + minute + second;
        return generatedString;
      }
  
    // Add more static methods as needed
}


