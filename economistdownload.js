
/*
http://audiocdn.economist.com/sites/default/files/AudioArchive/2021/20210102/Issue_9226_20210102_The_Economist_Full_edition.zip

9136
http://audiocdn.economist.com/sites/default/files/AudioArchive/2019/20190330/Issue_9136_20190330_The_Economist_Full_Edition.zip

8796
2012-08-04
http://audiocdn.economist.com/sites/default/files/AudioArchive/2012/20120804/20120804_TheEconomist_Full_Edition.zip

http://audiocdn.economist.com/sites/default/files/AudioArchive/2007/20070526/20070526_TheEconomist_Full_Edition.zip
*/

//https://www.economist.com/img/b/1280/720/90/sites/default/files/20091128issuecovUS400.jpg


//https://www.economist.com/img/b/400/526/90/sites/default/files/20101127_CNA400.jpg

//https://www.economist.com/img/b/1280/1683/90/sites/default/files/20110101_CNA400.jpg

//https://www.economist.com/img/b/1280/1683/90/sites/default/files/20120602_cna400.jpg

//https://www.economist.com/img/b/1280/1683/90/sites/default/files/print-covers/20190105_cuk400hires.jpg

//https://www.economist.com/img/b/1280/1683/90/sites/default/files/print-covers/20181222_cna400.jpg

//https://www.economist.com/img/b/1280/1683/90/sites/default/files/print-covers/20170107_cna400.jpg

var imgurl = "https://www.economist.com/img/b/400/526/90/sites/default/files/print-covers/{0}_{1}.jpg";
var imgurl_2012 = "https://www.economist.com/img/b/400/526/90/sites/default/files/{0}_{1}.jpg"

var imgurlfiles = ['cna1280','cuk1280','de_us','de_uk','cna400','cuk400','cuk400hires','cna400hires','CNA400'];

var imghref = "https://www.economist.com/printedition/{0}";

let extension = {
  download: "zip", 
  online: "m4a"
};
//var filename = "The_Economist_Full_edition";

const cdnurl = "https://audiocdn.economist.com/sites/default/files/AudioArchive/";

var urlstr_2012 = cdnurl + "{0}/{1}/{1}_TheEconomist_Full_Edition.{2}";
var urlstr_2019 = cdnurl + "{0}/{1}/Issue_{2}_{1}_The_Economist_Full_Edition.{3}";
var urlstr = cdnurl + "{0}/{1}/Issue_{2}_{1}_The_Economist_Full_edition.{3}";

const InitiaYear = 2021;
const InitialDate = new Date(InitiaYear,0,2);
const InitiaIssue = 9226;

let MyEdition = {
	Date: "", //Weekly Edition Date
  Issue: "", //Weekly Edition Issue
	Title: "", //Title text
	Image: "",//Cover image HTML 
	AudioURL: "", //Audio URL
	DownloadURL: "",//Mp3 zip file URL
	ContentIndex: "" //content index   
};


function getEditionByDate(){
    
  var year = document.getElementById("year").value;
  var month = document.getElementById("month").value;
  var day = document.getElementById("day").selectedIndex+1;
  var d = getEditionDate(year,month,day);
  if (d != null){
	this.document.getElementById("edition_content").style.display = 'block';
	MyEdition = getEdition(d);
	
	this.document.getElementById("edition_title").innerHTML = MyEdition.Title;

  this.document.getElementById("edition_img").innerHTML = MyEdition.Image;
	
  this.document.getElementById("edition_url").innerHTML = MyEdition.Title.link(MyEdition.DownloadURL);
	
	this.document.getElementById("edition_audiosource").src = MyEdition.AudioURL;
  audio = this.document.getElementById("edition_audio");
  audio.preload = "metadata";
  audio.load();

  }
  else
	  this.document.getElementById("edition_title").innerHTML = "Error!";

}

function getEditionDate(year,month,day){
  var d = new Date(year, month, day);

  dayofweek = d.getDay();
  //console.log(dayofweek);
  if (dayofweek<6)
	d = new Date(year, month, day-1-dayofweek);
  //special case 
  if (d.getFullYear() ==2011 && d.getMonth() == 11 && d.getDate() >=24)
    return new Date(2011, 11, 31);

  if (d.getMonth() == 11 && d.getDate() >24 ){
    return getEditionDate(year, month, day-7);
   } //Christmas
else
  return d;
}


function getEdition(d){
  edition = new Object();
  edition.Date = d.toISOString().slice(0, 10);
  edition.Issue = getEditionIssue(d);
	edition.Title = getEditionTitle(d);
	edition.Image = getEditionImg(d);
	URLs = getEditionURL(d);
	edition.AudioURL = URLs.audio;
  edition.DownloadURL = URLs.download;

	return edition;

	}

function getEditionTitle(d){
//need to retrive title from official website
// use Date for now.
	return "Weekly Edition "+d.toISOString().slice(0, 10);
}


function getEditionImg(d){
  var imageresults = document.createElement("a");
  var datestr=d.toISOString().slice(0, 10);
  var url;
  if (d<new Date(2012,8,22))
  url = imgurl_2012;
  else 
  url = imgurl;
 
  for(var i=0; i < imgurlfiles.length; i++){
    var img = document.createElement('img'); 
    img.src=url.format(datestr.replace(/-/g, ''),imgurlfiles[i]);
    img.alt = "";
	imageresults.appendChild(img);	
  }
  
  imageresults.href = imghref.format(datestr); 
  imageresults.target = "_blank";
  return imageresults.outerHTML; 
}


function getEditionURL(d){
  datestr=d.toISOString().slice(0, 10).replace(/-/g, '');
  year=datestr.slice(0,4);

  issuestr=getEditionIssue(d);
  //console.log(issuestr);
  var URLs = {
    date:"",
    audio:"",
    download:"" 
  }

  var urlstr_2012 = cdnurl + "{0}/{1}/{1}_TheEconomist_Full_Edition.{2}";
  var urlstr_2019 = cdnurl + "{0}/{1}/Issue_{2}_{1}_The_Economist_Full_Edition.{3}";
  var urlstr = cdnurl + "{0}/{1}/Issue_{2}_{1}_The_Economist_Full_edition.{3}";
  URLs.date = datestr;
  if (issuestr< 9136 && issuestr> 9133){
    URLs.audio = urlstr.format(year,datestr,issuestr,extension.online);
    URLs.download = urlstr_2019.format(year,datestr,issuestr,extension.download); 
  }else if (issuestr> 8796){
    URLs.audio = urlstr.format(year,datestr,issuestr,extension.online);
    URLs.download = urlstr.format(year,datestr,issuestr,extension.download);
  }else {
    URLs.audio = urlstr_2012.format(year,datestr,extension.online);
    URLs.download = urlstr_2012.format(year,datestr,extension.download);
  }
  return URLs;
}

function getEditionIssue(d){
	return Math.round(InitiaIssue - (year-InitiaYear) + (d-InitialDate)/(1000*60*60*24*7));
}


function getDownloadList(){
	this.document.getElementById("list").innerHTML = "";
	year=document.getElementById("year_d").value;
	
	var d = getEditionDate(year,0,6);
	var day = d.getDate();
	
	for(i = 0; i < 51; i++){

    URLs = getEditionURL(new Date(year,0,day+i*7));
		this.document.getElementById("list").innerHTML += URLs.date.link(URLs.download) + "<br />";
	}
}






String.prototype.format = function(){
   var content = this;
   for (var i=0; i < arguments.length; i++)
   {
        var replacement = '{' + i + '}';
        content = content.replaceAll(replacement, arguments[i]);  
   }
   return content;
};


document.addEventListener('error', function (event) {
	if (event.target.tagName.toLowerCase() !== 'img') return;
	event.target.style.display = 'none';
}, true);



