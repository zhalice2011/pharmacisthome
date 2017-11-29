
//用来放回复消息的模板   不同的消息回复 通过type进行判断
import ejs from 'ejs'

const tpl = `<xml>

            <ToUserName><![CDATA[<%=toUserName%>]]></ToUserName>

            <FromUserName><![CDATA[<%=fromUserName%>]]></FromUserName>

            <CreateTime><%=creatTime%></CreateTime>

            <MsgType><![CDATA[<%=msgType%>]]></MsgType>
            
            <% if(msgType === 'text') { %>  
                <Content><![CDATA[<%- content %>]]></Content>
            <% }else if(msgType === 'image') { %>
                <Image>
                    <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
                </Image>
            <% }else if(msgType === 'voice') { %>
                <Voice>
                    <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
                </Voice>
            <% }else if(msgType === 'video') { %>
                <Video>
                    <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
                    <Title><![CDATA[<%= content.title %>]]></Title>
                    <Description><![CDATA[<%= content.description %>]]></Description>
                </Video> 

            <% }else if(msgType === 'music') { %>
                <Music>
                    <Title><![CDATA[TITLE]]></Title>
                    <Description><![CDATA[<%= content.description %>]]></Description>
                    <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
                    <HQMusicUrl><![CDATA[<%= content.hqmMusicUrl %>]]></HQMusicUrl>
                    <ThumbMediaId><![CDATA[<%= content.mediaId %>]]></ThumbMediaId>
                </Music>    
            <% }else if(msgType === 'new') { %>
                <ArticleCount><%= content.length %></ArticleCount>
                <Articles>

                    <% content.forEach(function(item){ %>
                        <item>
                            <Title><![CDATA[<%= item.title %>]]></Title> 
                            <Description><![CDATA[<%= item.description %>]]></Description>
                            <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
                            <Url><![CDATA[<%= item.url %>]]></Url>
                        </item>
                    <% }) %>

                </Articles>                            
            <%} %>
                

            </xml>`

//编译模板
const compiled = ejs.compile(tpl)

//暴露出这个compiled
export default compiled


