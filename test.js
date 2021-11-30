var url = new URL("http://foo.bar/");

// If your expected result is "http://foo.bar/?x=1&y=2&x=42"
url.searchParams.append('x', 42);
url.searchParams.append('y', 21);

console.log(url.href)