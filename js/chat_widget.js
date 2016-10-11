(function($) {

// Localize jQuery variable
var jQuery;
var mywidget = null;
var socket_url = 'https://tornado-socket.herokuapp.com/echo'; // https://tornado-socket.herokuapp.com/echo
var api_token = 'abcd1234'; //qwerty987
var ip = '54.78.204.208';
var image_url = "images/";
var bot_messages = ["Hello, I 'm Chatbot. I try to be helpful."
                    ,"Type something to get started"
                    ,"If you have any question about how to use Chat, please ask me!"
                    ,"I'll do my best to help. <br/>Thanks."];
var bot_username = "Bot";
var bot_msg_index;
var bot_msg_length;
var username;
var messages;
var socket;
var logs = [];
var log_cur_pos = 0;

$.fn.chatWidget = function(socket_url_param, api_token_param) {
    /******** Load jQuery if not present *********/
    if (socket_url_param != undefined)
        socket_url = socket_url_param;
    if (api_token_param != undefined)
        api_token = api_token_param;
    mywidget = this;
    jQuery = window.jQuery;
    main(mywidget);
    return this;
}

/******** Our main function ********/
function main(mywidget) { 
    // console.log("main function is called");
    jQuery(document).ready(function($) {    
        if (mywidget != null)
        {
            init();
            makeMinimizeWidget(mywidget);
            // socket = connect(socket_url, api_token);
        }
    });
}
function init(){
    username = null;
    messages = null;
    socket = null;
    bot_msg_index = 0;
    bot_msg_length = bot_messages.length;
    bot_username = "Bot";
    logs = [];
    log_cur_pos = 0;
}
function shortenName(name)
{
    if (name == undefined || name == null) return "";
    if (name.length > 10)
        return name.substring(0,10) + "...";
    else
        return name;
}
function makeMinimizeWidget(mywidget){
    var html = "";
    html = '<div id="mini-chat-161011"> \
                <img src="' + image_url + 'message.png"/> \
                <p>Chat With Us</p> \
        </div>';
    html += '<div id="live-chat-161011"> \
            <header class="clearfix"> \
                <a href="#" class="chat-close"><img style="width: 13px;" src="' + image_url + 'close.png" /></a> \
                <h4 id="title_content"><a href="http://www.apartmentocean.com/real-estate-bot"><span>Powered by </span> \
                    <img src= "' + image_url + 'logo.png" class="logo"/> <span class="apartment">ApartmentOcean</span></a></h4> \
            </header> \
            <div class="chat-login"> \
                <div class="chat-text"> \
                    <p class="back1">Operator is <span>Online</span></p> \
                    <p class="back2">And ready to answer your questions.</p> \
                </div> \
                <div class="chat_input"> \
                    <input type="text" placeholder="What\'s your name?" id="username"/>\
                    <input type="button" value="Go" class="submit_user" /> \
                </div> \
            </div> \
            <div class="chat-body"> \
                <div id="log" class="chat-history"> \
                </div> \
                <div id="text-input"> \
                    <fieldset> \
                        <textarea id="message_input" placeholder="Type your message here" autofocus></textarea> \
                        <input type="hidden"> \
                    </fieldset> \
                    <div class="send_buttons"> \
                        <input type="button" value="Send" class="send-msg-btn"/> \
                        <img src="' + image_url + 'attach.png" class="send_attach_file_btn" /> \
                        <input type="file" id="attach_file" accept="image/*"/> \
                    </div> \
                </div> \
                <div id="typingnow"> \
                    <p><img src="' + image_url + 'pencil.png" /> <span>' + shortenName(username) + ' is typing ...</span></p> \
                </div> \
            </div> \
        </div>';
    // $(mywidget.selector).html(html);
    $('body').append(html);
    messages = $('#live-chat-161011 #log');
}
function updateLog(){
    if (log_cur_pos < logs.length)
    {
        var html = "", sub_html = "";
        var i ,ii;
        for (i=log_cur_pos;i<logs.length;i++)
        {
            if (logs[i].type == "message")
            {
                sub_html = logs[i].message;
            }
            else if (logs[i].type == "attach")
            {
                var reader = new FileReader();
                ii = i;
                reader.onload = function(e){
                    sub_html = '<img src="' + e.target.result + '" style="width: 170px;"/>';
                    messages.find(".chat-message[attr='" + ii + "'] p.chat-content").html(sub_html);
                    messages.scrollTop(messages.get(0).scrollHeight);
                }
                reader.readAsDataURL(logs[i].url);
            }
            else ;
            if (logs[i].username == username)
            {
                html += '<div class="chat-message clearfix" attr="' + i + '"> \
                        <div style="width: 40px; float: left; margin-right: 5px;"><img src="' + image_url + 'avatar.png" /></div> \
                        <div style="width: 170px; float: left;"> \
                            <p class="chat-user">' + username + '</p> \
                            <p class="chat-content">' + sub_html + '</p> \
                        </div> \
                    </div>';
            }
            else
            {
                html += '<div class="chat-message opposite-message clearfix" attr="' + i + '"> \
                        <div style="width: 40px; float: right;"><img src="' + image_url + 'icon.png" /></div> \
                        <div style="max-width: 170px; float: right; margin-right: 5px;"> \
                            <p class="chat-user">' + logs[i].username + '</p> \
                            <p class="chat-content">' + sub_html + '</p> \
                        </div> \
                    </div>';
            }
        }
        messages.append(html);
        messages.scrollTop(messages.get(0).scrollHeight);
        log_cur_pos = logs.length;
    }
}
$(document).on('click', '#mini-chat-161011', function(){
    $('#mini-chat-161011').hide("fast");
    $('#live-chat-161011').show("fast");
})
$(document).on('click','#live-chat-161011 header', function() {
    $('#live-chat-161011 .chat').slideToggle(300, 'swing');
    $('#live-chat-161011 .chat-message-counter').fadeToggle(300, 'swing');
    messages.scrollTop(messages.get(0).scrollHeight);
});
$(document).on('click','.chat-close', function(e) {
    e.preventDefault();
    $('#live-chat-161011').fadeOut(300);
    $('#mini-chat-161011').show("fast");
});
function scroll_to(div){
   if (div.scrollTop < div.scrollHeight - div.clientHeight)
        div.scrollTop += 10; // move down
}
$(document).on('click','#live-chat-161011 .submit_user', function(event){
    var user_name = $('#live-chat-161011 #username').val();
    if(user_name != "" ) // && socket != null
    {
        $('#live-chat-161011 .chat-login').css('display','none');
        $('#live-chat-161011 .chat-body').css('display','block');
        username = user_name;
    }
})
$(document).on('click','#live-chat-161011 .send-msg-btn', function(){
    var message = $('#live-chat-161011 #message_input').val();
    var obj = {};
    obj["time"] = new Date();
    obj["username"] = username;
    obj["message"] = message;
    obj["type"] = "message";
    logs.push(obj);

    setTimeout(function(){
        var obj = {};
        obj["time"] = new Date();
        obj["username"] = bot_username;
        obj["message"] = bot_messages[bot_msg_index];
        obj["type"] = "message";
        bot_msg_index = Math.floor(Math.random() * bot_msg_length);
        logs.push(obj);
        updateLog();
    }, 1000);
    updateLog();
    $('#live-chat-161011 #typingnow').css('display','none');
    $('#live-chat-161011 #message_input').val('')
})
$(document).on('click', '#live-chat-161011 .send_attach_file_btn', function(){
    $('#live-chat-161011 #attach_file').click();
})
$(document).on('change', '#live-chat-161011 #attach_file', function(){
    var obj = {};
    obj["time"] = new Date();
    obj["username"] = username;
    obj["url"] = this.files[0];
    obj["type"] = "attach";
    logs.push(obj);
    updateLog();
})
$(document).on('keyup',"#live-chat-161011 #message_input", function(event){
    var msg = $(this).val();
    if (msg != "")
    {
        $('#live-chat-161011 #typingnow').css('display','block');
        $('#live-chat-161011 #typingnow p span').html(username + " is typing...");
    }
    else
        $('#live-chat-161011 #typingnow').css('display','none');
});

})(jQuery); // We call our anonymous function immediately