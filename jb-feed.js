import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';import {JB_FEED_CONFIG as C} from './jb-feed-config.js?v=20261017-5';
const $=id=>document.getElementById(id),admin=/\/(jb-admin|jb-studio)\.html$/.test(location.pathname);
const ready=Boolean(C.supabaseUrl&&C.supabasePublishableKey),client=ready?createClient(C.supabaseUrl,C.supabasePublishableKey):null;

// Prevent duplicate submissions and duplicate media in the published feed.
let uploadInProgress=false;
async function mediaFingerprint(file){
 const bytes=await file.arrayBuffer();
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
}
async function alreadyPublished(file){
 const fingerprint=await mediaFingerprint(file);
 const {data,error}=await client.from(C.tablePosts).select('id,media_path').like('media_path','%/'+fingerprint+'-%').limit(1);
 if(error)throw error;
 return {fingerprint,exists:Boolean(data?.length)};
}
if(!admin&&C.stripeSubscriptionUrl){$('subscribe').href=C.stripeSubscriptionUrl;$('subscribe').hidden=false}
if(!ready){$('loginMessage').textContent='JB member system is awaiting setup.';const btn=$('login').querySelector('button');if(btn)btn.disabled=true;}
else{
if(admin){
  const form=$('magicSignIn');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const email=$('email').value.trim().toLowerCase();
    if(email!=='blakeallen1232@gmail.com'){$('loginMessage').textContent='Use the authorized JB administrator email.';return}
    const button=form.querySelector('button');button.disabled=true;
    const redirectTo=new URL('./jb-studio.html?jb_login=1',location.href).href;
    const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo,shouldCreateUser:false}});
    button.disabled=false;
    $('loginMessage').textContent=error?error.message:'Check your email for the JB administrator sign-in link. Open it in this browser.';
  });
  const url=new URL(location.href);
  const hash=new URLSearchParams(url.hash.slice(1));
  const authError=url.searchParams.get('error_description')||hash.get('error_description');
  if(authError)$('loginMessage').textContent='Sign-in link error: '+authError;
  const code=url.searchParams.get('code');
  if(code){client.auth.exchangeCodeForSession(code).then(({error})=>{if(error)$('loginMessage').textContent=error.message;else history.replaceState(null,'',location.pathname)});}
  const tokenHash=url.searchParams.get('token_hash');
  if(tokenHash){client.auth.verifyOtp({token_hash:tokenHash,type:'magiclink'}).then(({error})=>{if(error)$('loginMessage').textContent=error.message;else history.replaceState(null,'',location.pathname)});}
  if(hash.has('access_token')&&hash.has('refresh_token')){client.auth.setSession({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token')}).then(({error})=>{if(error)$('loginMessage').textContent='Sign-in verification failed: '+error.message;else history.replaceState(null,'',location.pathname)});}
  if(url.searchParams.get('jb_login')==='1'&&!code&&!tokenHash&&!hash.has('access_token')&&!authError){$('loginMessage').textContent='The email opened JB, but did not contain a verification token. Check Supabase Magic Link email template: its link must use {{ .ConfirmationURL }}, not {{ .RedirectTo }} or {{ .SiteURL }}.';}
} else {
$('signIn').addEventListener('submit',async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;const {error}=await client.auth.signInWithPassword({email:$('email').value.trim().toLowerCase(),password:$('password').value});button.disabled=false;$('loginMessage').textContent=error?error.message:'Signed in.'});
$('signUp').onclick=async()=>{const email=$('email').value.trim().toLowerCase(),password=$('password').value;if(!email||password.length<8){$('loginMessage').textContent='Enter an email and a password of at least 8 characters.';return}const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});$('loginMessage').textContent=error?error.message:data.session?'Signed in.':'Check your email to verify your account.'};
$('resetPassword').onclick=async()=>{const email=$('email').value.trim();if(!email){$('loginMessage').textContent='Enter your email first.';return}const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:new URL('./jb-reset.html',location.href).href});$('loginMessage').textContent=error?error.message:'Check your email for password reset instructions.'};
$('logout').onclick=async()=>{await client.auth.signOut();location.reload()};
}
client.auth.onAuthStateChange(event=>{if(['SIGNED_IN','SIGNED_OUT','INITIAL_SESSION'].includes(event))setTimeout(init,0)});
let version=0;async function init(){const current=++version,{data:{user}}=await client.auth.getUser();$('login').hidden=!!user;$('members').hidden=!user;if(!user)return;$('account').textContent=user.email;const {data:member,error:membershipError}=await client.from(C.tableMemberships).select('role').eq('user_id',user.id).maybeSingle();if(membershipError){$('memberStatus').textContent='Membership setup is incomplete.';return}if(admin){if(member?.role!=='admin'){$('memberStatus').textContent='Administrator access required.';return}$('memberStatus').textContent='Admin verified.';$('uploadForm').hidden=false;return}const {data:access,error:accessError}=await client.rpc(C.accessFunction);if(accessError){$('memberStatus').textContent='Subscription verification is not configured yet.';return}if(access!==true){$('memberStatus').textContent='No active JB Daily Feed subscription found for this account.';return}$('memberStatus').textContent='Welcome to JB Daily Feed.';const {data:posts,error}=await client.from(C.tablePosts).select('id,title,description,category,created_at,media_path,media_type').order('created_at',{ascending:false});if(current!==version)return;if(error){$('memberStatus').textContent='Unable to load posts.';return}const holder=$('posts');holder.replaceChildren();if(!posts?.length){holder.textContent='First drop coming soon.';return}for(const post of posts){const {data:signed,error:signError}=await client.storage.from(C.storageBucket).createSignedUrl(post.media_path,1800);if(signError||current!==version)continue;const article=document.createElement('article');article.className='post';const media=document.createElement(post.media_type==='image'?'img':'video');media.src=signed.signedUrl;if(media.tagName==='IMG'){media.alt=post.title;media.loading='lazy'}else{media.controls=true;media.playsInline=true;media.preload='none'}const details=document.createElement('div');details.className='details';const cat=document.createElement('small');cat.textContent=post.category||'DAILY DROP';const title=document.createElement('h2');title.textContent=post.title;const date=document.createElement('time');date.textContent=new Date(post.created_at).toLocaleDateString();const desc=document.createElement('p');desc.textContent=post.description||'';details.append(cat,title,date,desc);if(member?.role==='admin'){const del=document.createElement('button');del.className='delete-post';del.textContent='DELETE POST';del.onclick=async()=>{if(!confirm('Delete this post?'))return;del.disabled=true;const {error}=await client.from(C.tablePosts).delete().eq('id',post.id);if(error){alert(error.message);del.disabled=false;return}article.remove();await client.storage.from(C.storageBucket).remove([post.media_path])};details.append(del)}article.append(media,details);holder.append(article)}}
if(admin)$('uploadForm').onsubmit=async e=>{e.preventDefault();if(uploadInProgress)return;const form=e.currentTarget,file=form.elements.media.files[0],out=$('uploadStatus'),button=$('publish');if(!file)return;const isImage=file.type.startsWith('image/');if(!['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'].includes(file.type)||file.size>(isImage?15:250)*1048576){out.textContent='Unsupported file or file too large (15MB photo / 250MB video).';return}uploadInProgress=true;button.disabled=true;out.textContent='Checking for duplicates…';try{const {data:{user}}=await client.auth.getUser();const path=user.id+'/'+crypto.randomUUID()+'-'+file.name.replace(/[^\w.-]/g,'_');const {error:uploadError}=await client.storage.from(C.storageBucket).upload(path,file,{contentType:file.type});if(uploadError)throw uploadError;const {error:insertError}=await client.from(C.tablePosts).insert({title:form.elements.title.value.trim(),description:form.elements.description.value.trim(),category:form.elements.category.value,media_path:path,media_type:isImage?'image':'video'});if(insertError)throw insertError;form.reset();out.textContent='Published successfully.'}catch(err){out.textContent='Upload failed: '+err.message}finally{uploadInProgress=false;button.disabled=false}};
init();}
