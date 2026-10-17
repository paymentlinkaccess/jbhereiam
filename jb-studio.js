import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {JB_FEED_CONFIG as C} from './jb-feed-config.js?v=20261017-7';
const $=id=>document.getElementById(id);
const client=createClient(C.supabaseUrl,C.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
let verified=false;
async function refresh(){
 const {data:{user}}=await client.auth.getUser();
 const {data:membership}=user?await client.from(C.tableMemberships).select('role').eq('user_id',user.id).maybeSingle():{data:null};
 verified=Boolean(user&&user.email?.toLowerCase()==='blakeallen1232@gmail.com'&&membership?.role==='admin');
 $('authPanel').hidden=verified;$('logout').hidden=!user;$('account').textContent=user?.email||'';
 $('publish').disabled=!verified;
 $('memberStatus').textContent=verified?'Admin verified. Uploads enabled on this device.':'Authorize this device once to enable private uploads and preview.';
 if(verified)await loadPreview();else{$('previewPosts').replaceChildren();$('previewStatus').textContent='Preview requires JB administrator authorization.'}
}
$('authForm').addEventListener('submit',async e=>{
 e.preventDefault();const email=$('adminEmail').value.trim().toLowerCase(),password=$('adminPassword').value;
 if(email!=='blakeallen1232@gmail.com'){$('authMessage').textContent='Use the JB administrator email.';return}
 const button=e.currentTarget.querySelector('button');button.disabled=true;
 const {error}=await client.auth.signInWithPassword({email,password});button.disabled=false;
 $('adminPassword').value='';
 if(error){$('authMessage').textContent=error.message;return}
 await refresh();if(!verified)$('authMessage').textContent='Signed in, but this account has no JB administrator permission.';
});
$('logout').addEventListener('click',async()=>{await client.auth.signOut();await refresh()});
async function loadPreview(){
 if(!verified)return;
 const holder=$('previewPosts');holder.replaceChildren();$('previewStatus').textContent='Loading feed…';
 const {data:posts,error}=await client.from(C.tablePosts).select('title,description,category,created_at,media_path,media_type').order('created_at',{ascending:false});
 if(error){$('previewStatus').textContent='Feed error: '+error.message;return}
 $('previewStatus').textContent=posts.length?posts.length+' published post(s)':'No posts published yet.';
 for(const p of posts){
  const {data:media,error:err}=await client.storage.from(C.storageBucket).createSignedUrl(p.media_path,900);
  if(err||!media)continue;
  const article=document.createElement('article');article.className='post';
  const el=document.createElement(p.media_type==='video'?'video':'img');el.src=media.signedUrl;
  if(p.media_type==='video'){el.controls=true;el.playsInline=true;el.preload='metadata'}else{el.alt=p.title;el.loading='lazy'}
  const details=document.createElement('div');details.className='details';
  const cat=document.createElement('small');cat.textContent=p.category||'DAILY UPDATE';
  const title=document.createElement('h2');title.textContent=p.title;
  const desc=document.createElement('p');desc.textContent=p.description||'';
  details.append(cat,title,desc);article.append(el,details);holder.append(article)
 }
}
$('refreshPreview').addEventListener('click',loadPreview);
$('uploadForm').addEventListener('submit',async e=>{
 e.preventDefault();if(!verified){$('uploadStatus').textContent='Authorize this device first.';return}
 const form=e.currentTarget,file=form.elements.media.files[0],out=$('uploadStatus'),button=$('publish');
 if(!file)return;
 const image=file.type.startsWith('image/');
 if(!['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'].includes(file.type)||file.size>(image?15:250)*1048576){out.textContent='Unsupported file or too large (15 MB image / 250 MB video).';return}
 button.disabled=true;out.textContent='Uploading…';
 let path=null;
 try{
  const {data:{user}}=await client.auth.getUser();
  path=user.id+'/'+crypto.randomUUID()+'-'+file.name.replace(/[^\\w.-]/g,'_');
  const {error:up}=await client.storage.from(C.storageBucket).upload(path,file,{contentType:file.type});
  if(up)throw up;
  const {error:postError}=await client.from(C.tablePosts).insert({title:form.elements.title.value.trim(),description:form.elements.description.value.trim(),category:form.elements.category.value,media_path:path,media_type:image?'image':'video'});
  if(postError)throw postError;
  form.reset();out.textContent='Published successfully.';await loadPreview();
 }catch(err){out.textContent='Upload failed: '+err.message;if(path)await client.storage.from(C.storageBucket).remove([path])}
 finally{button.disabled=!verified}
});
client.auth.onAuthStateChange(()=>{setTimeout(refresh,0)});
refresh();
