# Parcel Tracker
A UPS package tracking application - When provided with UPS Tracking Number(s) it will fetch the data from the United Postal Service and displays them in a table. Users can also click the '+' button under the 'Expand' column for more information on a particular package. Multiple tracking numbers can be entered into the search at once if they are separated by a space (i.e {tracking_1} {tracking_2} {...}). Users can download the table as a .csv(comma-separated values) file.

![Imgur](https://imgur.com/c8GX7RT.gif)

<a href='https://parcel-tracker.up.railway.app/'>Live Site</a>

## Tech : ![mongoDb](https://img.shields.io/static/v1?label=|&message=mongoDB&style=plastic&logo=mongodb) ![expressjs](https://img.shields.io/static/v1?label=|&message=express.js&style=plastic&logo=express) ![nodejs](https://img.shields.io/static/v1?label=|&message=nodejs&style=plastic&logo=nodedotjs)

# Optimizations
Improved data storage by implementing mongoDB Atlas allowing for better future scalability. Overall much faster than storing the data locally in a JSON.

# Future Implementations
- Add the ability to track packages from all United States shipping services such as USPS, FedEx, DHL, and LaserShip.
- User account/profiles