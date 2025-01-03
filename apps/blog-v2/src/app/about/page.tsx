import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About This Site</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to My Tech Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This blog is a platform where I share my thoughts, experiences, and knowledge about various topics in technology, 
            particularly focusing on web development, software engineering, and emerging technologies. As a passionate developer and lifelong learner, I strive to provide valuable insights, tutorials, and discussions that can help both beginners and experienced professionals in their tech journey.
          </p>
          <p className="mb-4">
            The content on this blog covers a wide range of topics, including but not limited to:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Front-end development (React, Vue, Angular)</li>
            <li>Back-end development (Node.js, Python, Ruby)</li>
            <li>DevOps and cloud technologies</li>
            <li>Best practices in software architecture and design</li>
            <li>Performance optimization techniques</li>
            <li>Latest trends in web and mobile development</li>
          </ul>
          <p>
            I believe in the power of sharing knowledge and fostering a community of developers who support and learn from each other. Feel free to explore the articles, leave comments, and reach out if you have any questions or suggestions. Thank you for being a part of this journey!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

