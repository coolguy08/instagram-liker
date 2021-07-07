const puppeteer=require('puppeteer');

let {username,password}=require('./config');

let search_term=process.argv.slice(2)?process.argv.slice(2)[0]:null;

if(!search_term){

    console.log("Please provide search term");
    return;
}

let browser,tab;


async function login(username,password){
     await tab.waitForSelector("input[name='username']");
     await tab.type("input[name='username']",username,{delay:100});
     await tab.type("input[name='password']",password,{delay:100});
     await tab.click("button[type='submit']");
     await tab.waitForSelector("input[placeholder='Search']");
}

async function search(query){
    await tab.type("input[placeholder='Search']",query);
    await tab.waitForSelector('.-qQT3');
    await tab.click('.-qQT3');
    await tab.waitForSelector('article a'); //waiting to go to first search
    await tab.click('article a'); //clicking on the first post
    await tab.waitForSelector("article[role='presentation']") // waiting to open first post
}

async function likePost(){
    let elem=await tab.$("section svg[aria-label='Like']")
    
    if(elem!=null){ // checking if it is liked previously then dont do this

        await tab.waitForSelector("section svg[aria-label='Like']");
        await tab.click("section svg[aria-label='Like']");
    }
   
}

async function LikeAllPosts(){
    
    for(let i=0;i<10;i++){
        await tab.waitForTimeout(3000);
        await likePost();
        await tab.waitForTimeout(2000);
        await tab.click(".coreSpriteRightPaginationArrow");
    }
}


async function main(){
   browser=await puppeteer.launch({headless:false,defaultViewport:null});
   let page=await browser.pages();
   tab=page[0];
   await tab.goto('https://www.instagram.com/');
   await login(username,password);
   await search(search_term)
   await LikeAllPosts();
   console.log("all post liked");
}

main();