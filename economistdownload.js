/*
Created by Jing on Apr 19, 2021
Bugs fix by Keven Li
Retrive the audio file archive from The Economist CDN server.
*/

const cdnurl = "https://audiocdn.economist.com/sites/default/files/AudioArchive/";

var urlstr_2012 = cdnurl + "{0}/{1}/{1}_TheEconomist_Full_Edition.{2}";
var urlstr_2019 = cdnurl + "{0}/{1}/Issue_{2}_{1}_The_Economist_Full_Edition.{3}";
var urlstr = cdnurl + "{0}/{1}/Issue_{2}_{1}_The_Economist_Full_edition.{3}";
//file extension
let extension = {
  download: "zip", 
  online: "m4a"
};
const InitiaYear = 2021;
const InitialDate = new Date(InitiaYear,0,2);
const InitiaIssue = 9226;
//cover image config 
var imgurlconfig = [
{
	date:new Date(2000,0,1),//2000-01-01,//
	urlconfig:{
		imgurl: "https://www.economist.com/img/b/400/526/90/sites/default/files/{0}issuecov{1}.jpg",
		file:['US400','UK400']
	}
},
{
	date:new Date(2010,8,5),//2010-09-05,//>= 2010-09-11
	urlconfig:{
		imgurl: "https://www.economist.com/img/b/400/526/90/sites/default/files/{0}_{1}.jpg",
		file:['cna400','cuk400','cuk400hires','cna400hires','CNA400']
	}
},
{
	date:new Date(2012,8,16),//2012-09-16,//>= 2012-09-22
	urlconfig:{
		imgurl: "https://www.economist.com/img/b/1280/1684/90/sites/default/files/print-covers/{0}_{1}.jpg",
		file:['cna1280','cuk1280','de_us','de_uk','cna400','cuk400','cna400hires', 'cna1248']
	}
}
];
//content ref
var imghref = "https://www.economist.com/printedition/{0}";


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
	var day = document.getElementById("day").selectedIndex + 2;
	var d = getEditionDate(year,month,day);
	if (d != null){
		this.document.getElementById("edition_content").style.display = 'block';
		MyEdition = getEdition(d);
		if (MyEdition != null){
			this.document.getElementById("edition_title").innerHTML = MyEdition.Title;
			this.document.getElementById("edition_img").innerHTML = MyEdition.Image;
			this.document.getElementById("edition_url").innerHTML = MyEdition.Title.link(MyEdition.DownloadURL);	
			this.document.getElementById("edition_audiosource").src = MyEdition.AudioURL;
			audio = this.document.getElementById("edition_audio");
			audio.preload = "metadata";
			audio.load();
		}
	}
	else
		this.document.getElementById("edition_title").innerHTML = "Error!";
}

//input any date, return valid weekly edition date
function getEditionDate(year, month, day) {
	var d = new Date(year, month, day);

	dayofweek = d.getDay();
	//console.log(dayofweek);
	if (dayofweek <= 6)
		d = new Date(year, month, day - dayofweek); //fixed the wrong date bug
	//special case
	if (d.getFullYear() == 2011 && d.getMonth() == 11 && d.getDate() >= 24)
		return new Date(2011, 11, 31);

	if (d.getMonth() == 11 && d.getDate() > 24) {
		return getEditionDate(year, month, day - 7);
	} //Christmas
	else
		return d;
}

//assemble myedition
function getEdition(d){
	if (d != null){
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
	else 
		return null;
 }

function getEditionTitle(d){
//TODO: need to retrive title from official website
//use Date as a placeholder for now.
	return "Weekly Edition "+d.toISOString().slice(0, 10);
}

//get cover image and asseble HTML output
function getEditionImg(d){
	var imageresults = document.createElement("a");
	var datestr=d.toISOString().slice(0, 10);
	  
	var i=0;
	while((i < imgurlconfig.length) && (d > imgurlconfig[i].date)){
		i++;
	}
	var url = imgurlconfig[i-1].urlconfig.imgurl;
	var files = imgurlconfig[i-1].urlconfig.file;  
	 
	for(i=0; i < files.length; i++){
		var img = document.createElement('img'); 
		img.src=url.format(datestr.replace(/-/g, ''),files[i]);
		img.alt = "";
		imageresults.appendChild(img);	
	}
	  
	imageresults.href = imghref.format(datestr); 
	imageresults.target = "_blank";
	return imageresults.outerHTML; 
}

//input the weekly edition date, return date, m4a download url and zip file download url
function getEditionURL(d){
	if (d.getMonth() == 11 && d.getDate() >24 && d.getDate() <31) return null;
	datestr=d.toISOString().slice(0, 10).replace(/-/g, '');
	year=datestr.slice(0,4);

	issuestr=getEditionIssue(d);
	//console.log(issuestr);
	var URLs = {
		date:"",
		audio:"",
		download:"" 
	}

	URLs.date = datestr;
	if (issuestr== 9136){
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

//get annual download list
function getDownloadList(){
	this.document.getElementById("list").innerHTML = "";
	year=document.getElementById("year_d").value;
	
	var d = getEditionDate(year,0,7);
	var day = d.getDate();
	
	for(var i = day; i < 360; i=i+7){
		if (year == 2011 && i==358){
			i=365;
		}
		URLs = getEditionURL(new Date(year,0,i));
		if (URLs != null)
			this.document.getElementById("list").innerHTML += URLs.date.link(URLs.download) + "<br />";
	}
		
}


//string format function
String.prototype.format = function(){
   var content = this;
   for (var i=0; i < arguments.length; i++)
   {
        var replacement = '{' + i + '}';
        content = content.replaceAll(replacement, arguments[i]);  
   }
   return content;
};

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

//hide invalid images
document.addEventListener('error', function (event) {
	if (event.target.tagName.toLowerCase() !== 'img') return;
	event.target.style.display = 'none';
}, true);



