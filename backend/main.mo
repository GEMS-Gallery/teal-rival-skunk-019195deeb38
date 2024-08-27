import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Order "mo:base/Order";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];

  // Mutable variable for post counter
  var postCounter : Nat = 0;

  // Create a new post
  public func createPost(title: Text, body: Text, author: Text) : async Result.Result<Nat, Text> {
    let id = postCounter;
    let timestamp = Time.now();
    let newPost : Post = {
      id;
      title;
      body;
      author;
      timestamp;
    };
    posts := Array.append(posts, [newPost]);
    postCounter += 1;
    #ok(id)
  };

  // Get all posts sorted by recency
  public query func getPosts() : async [Post] {
    Array.sort(posts, func(a: Post, b: Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    })
  };

  // Get a single post by ID (optional function)
  public query func getPost(id: Nat) : async ?Post {
    Array.find(posts, func(post: Post) : Bool { post.id == id })
  };
}
