// COMPONENTS
//Blog - receives posts as a prop. 2 states: currentPost and displayMode. Has 2 callback functions to set state.

// HeroImage

// When displayMode = "List"
// HighlightPost
//  PostTitle
//  PostDate
//  PostContent
// SnippetPost
//  PostTitle
//  PostDate
//  PostContent

// When displayMode = "FullPost"
// FullPost - received currentPost as props (as an Object)
//  PostTitle
//  PostDate
//  PostContent
//  Related posts
//    SnippetPost
//      PostTitle
//      PostDate
//      PostContent

// Define Components - will split into modules IDC

// HeroImage
class HeroImage extends React.Component{
// TO DO Need to set default value in case no imageURL prop
	render(){
		const divStyle = {
			backgroundImage: "url(" + this.props.imageURL + ")",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		    backgroundSize: "cover",
		};
		return <div id="hero-image" style={divStyle} />
	}
}

// PostTitle
class PostTitle extends React.Component{
	render(){
		return <h1 className="title" dangerouslySetInnerHTML={{__html: this.props.title}} />
	}
}

// PostDate
class PostDate extends React.Component {
	render(){
		var options = { day: 'numeric', month: 'long', year: 'numeric' };
		var date = new Date(this.props.date);
		return <p className="meta">{date.toLocaleDateString('en-GB',options)}</p>
	}
}

// PostContent
class PostContent extends React.Component{
	render(){
		return <div className="wrapper" dangerouslySetInnerHTML={{__html: this.props.content}} />
	}
}

// PostImage
class PostImage extends React.Component{
	render(){
		return <img src={this.props.imageURL} />
	}
}

// TODO - for legacy posts
// PostSection

// PostSectionImage

// FullPost
class FullPost extends React.Component{
	constructor(props){
		super(props);
		this.showList = this.showList.bind(this);
	}

	showList(){
		this.props.setBlogMode("List");
	}

	// Parse this.props.post.content.rendered to split it into PostSections and PostSectionImage at every image tag.
	// Get all the image tags in an array, split content into sections at each image
	// Change each image to a PostSectionImage, change all other content into a PostSection
	// On the admin side, each page in automatically split into sections by images.
	// Need a manual way of creating sections. Maybe just by using normal HTML.
	// Change headers into H2.title, insert HR.section-dividers after them.

	// FEATURE IDEA: CSS is already set up to highlight Ps on hover
	// OnClick, extract P content text and post on twitter. Alternatively convert to image and then post.
	// OnMouseOver, add in a little 'tweet this' icon

	render(){
		return (
			<div id="full-post-container">
				<PostTitle title={this.props.post.title.rendered} />
				<PostDate date={this.props.post.date} />
				<hr className="section-divider" />
				<PostContent content={this.props.post.content.rendered} />
				<section><p className="read-more" onClick={this.showList}>Show all</p></section>
		    </div>
		)
	}
}

// SnippetPost
class SnippetPost extends React.Component{
	constructor(props){
		super(props);
		this.changePage = this.changePage.bind(this);
	}	

	changePage(){
		this.props.setCurrentPost(this.props.post.id);
		this.props.setBlogMode("FullPost");
		window.history.pushState(history.state, "this.props.post.title.rendered", "/index.html?post_id=" + this.props.post.id);
		ga('set', 'page', '/index.html?post_id=' + this.props.post.id);  // Sets new Google analytics page value
		ga('send', 'pageview');  // Logs the page hit
		console.log("GA hit logged");
	}

    // Receives Object post as a prop - straight from JSON response
    // and imageURL as a prop
	render(){
		return (
      		<div className="card-snippet-container" onClick={this.changePage}>
      		    <PostImage imageURL={this.props.imageURL} />
				<div className="card-content">
        			<PostTitle title={this.props.post.title.rendered} />
        			<PostDate date={this.props.post.date} />
        			<PostContent content={this.props.post.excerpt.rendered} />
        		</div>
        		<p className="read-more" onClick={this.changePage} >More...</p>
        	</div>
    	);
    }
}

// HighlightPost
class HighlightPost extends React.Component{
	constructor(props){
		super(props);
		this.changePage = this.changePage.bind(this);
	}	

	changePage(){
		this.props.setCurrentPost(this.props.post.id);
		this.props.setBlogMode("FullPost");
		window.history.pushState(history.state, "this.props.post.title.rendered", "/index.html?post_id=" + this.props.post.id);
		ga('set', 'page', '/index.html?post_id=' + this.props.post.id);  // Sets new Google analytics page value
		ga('send', 'pageview');  // Logs the page hit
		console.log("GA hit logged");
	}

    // Receives Object post as a prop - straight from JSON response
    // and imageURL as a prop
	render(){
		return (
      		<div className="card-highlight-container" onClick={this.changePage}>
	      		<div className="card-image" onClick={this.changePage}><PostImage imageURL={this.props.imageURL} /></div>
				<div className="card-content">
        			<PostTitle title={this.props.post.title.rendered} />
        			<PostDate date={this.props.post.date} />
        			<PostContent content={this.props.post.excerpt.rendered} />
        			<p className="read-more" onClick={this.changePage}>More...</p>
        		</div>
        	</div>
    	);
    }
}

// Blog.js
class Blog extends React.Component{
	constructor(props){
		super(props);

		// Searches posts array for page_id requested (sent as prop to initial Blog component)
		var postArray = this.props.posts;
		var postId = this.props.postId;
		var result = $.grep(postArray, function(e){ return e.id == postId; });

		// TODO: Only searches most recent posts - need something to pull post from archives.
		// Shows post if requested, otherwise shows list
		if(result.length>0) {
			this.state = {
				currentPost: result[0],
				displayMode: "FullPost"
			};	
		} else {
			this.state = {
				currentPost: null,
				displayMode: "List"
			};	
		}

		this.setCurrentPost = this.setCurrentPost.bind(this);
		this.setBlogMode = this.setBlogMode.bind(this);
	}

	setCurrentPost(currentPost){
		var currentPost = this.props.posts.filter(function (post) {	return post.id == currentPost });
		this.setState({	currentPost: currentPost[0] });
	}

	setBlogMode(displayMode){
		this.setState({ displayMode: displayMode });
	}

	render(){
		var pageData = [];
		var setCurrentPost = this.setCurrentPost;
		var setBlogMode = this.setBlogMode;

		switch(this.state.displayMode){
			case "FullPost":
				// Displays a single post (defined by this.state.currentPost)
				// Check that currentPost is defined, otherwise take first post in this.props.posts
				
				if(this.state.currentPost!=""){
					content = <FullPost post={this.state.currentPost} setCurrentPost={setCurrentPost} setBlogMode={this.setBlogMode} />
				} else {
					content = <FullPost post={this.props.posts[0]} setCurrentPost={setCurrentPost} setBlogMode={this.setBlogMode} />
				}

				content = (
					<div>
						<HeroImage imageURL="images/banner.png" />
						{content}
					</div>
				)
				break;

			default:
				window.history.pushState(history.state, "this.props.post.title.rendered", "/index.html");

				// Displays bloglist
				this.props.posts.forEach(function(element, index) {
					// Find first image tag in element.content.rendered
					var postContent = $(element.content.rendered);  // Uses jQuery to convert to html object
					var images = postContent.find("img");
					
					var firstImageURL = "images/freshies.jpg";  // Default image. Need to extract this somewhere more sensible

					if(images.length!=0){
						firstImageURL = images[0].src;
					}

					var highlight = index % 4 === 0;  // Sets every 4th post as a highlight post

					if(highlight){
						// Passes setCurrentPost as a callback function to allow setting of state (i.e. page and mode)
						pageData.push(<HighlightPost post={element} key={element.id} imageURL={firstImageURL} setCurrentPost={setCurrentPost} setBlogMode={setBlogMode} />);
					} else {
						// Passes setCurrentPost as a callback function to allow setting of state (i.e. page and mode)
						pageData.push(<SnippetPost post={element} key={element.id} imageURL={firstImageURL} setCurrentPost={setCurrentPost} setBlogMode={setBlogMode} />);
					}
				});

				var content = (
					<div>
						<HeroImage imageURL="images/IMG_20161128_135420.jpg" />
						<div className="card-list">
							{pageData}
						</div>
					</div>
				)
		}

		return content;
	}
}

// Retrieves HTML query string
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getPosts(url){
	// Get posts from wordpress
    var obj;
    $.ajax({
      url: url,
      type: "GET",
      async: false,  // Deprecated, but needed otherwise tries to render before ready
      dataType: "json",
      data: "per_page=8",
      success: function(data) {
        if (!data){
          console.log("Error fetching WordPress posts");
        } else {
			obj = data;
        }
      }.bind(this)
    });
    return obj;
}

var postId = getParameterByName('post_id');
// TODO: If postId!=null then run a getPosts using the post_id - get most recents posts AND get requested post
var posts = getPosts("http://www.dkcy.com/wp-json/wp/v2/posts/");

ReactDOM.render(
	<Blog posts={posts} postId={postId} />,
	document.getElementById('main')
);