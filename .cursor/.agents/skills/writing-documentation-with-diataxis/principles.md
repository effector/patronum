# Detailed Principles for Each Documentation Type

This file provides comprehensive guidance for each of the four Diataxis documentation types. Reference this when you need detailed principles, rationale, and examples.

## Tutorials: Learning-Oriented Documentation

### What Tutorials Are

A tutorial is a lesson that takes a learner by the hand through a practical learning experience. The purpose is to help the learner acquire basic competence and confidence through doing.

**Key insight**: Learning happens through action, not explanation. What the learner *does* is not necessarily what they *learn* - they learn concepts, relationships, and confidence through the actions they perform.

### Detailed Principles

#### 1. The Teacher's Responsibility

You are responsible for the learner's success. If something goes wrong, that's your problem, not theirs. The only responsibility of the learner is to be attentive and follow directions.

The tutorial must be:
- **Meaningful** - the learner needs a sense of achievement
- **Successful** - the learner must be able to complete it
- **Logical** - the path must make sense
- **Usefully complete** - encounters all key actions, concepts, and tools

#### 2. Ruthlessly Minimise Explanation

Explanation is the hardest temptation to resist. You want learners to *understand*, but explanation distracts from doing and blocks learning.

- Give minimal context: "We use HTTPS because it's more secure"
- Link to detailed explanation for later study
- Trust that understanding emerges from repeated action

Example of too much explanation:
```
We're using HTTPS because it provides encryption through TLS/SSL protocols,
which create a secure channel by using asymmetric cryptography to exchange
symmetric keys...
```

Better:
```
We use HTTPS because it's more secure. (For details on how HTTPS works,
see the security explanation.)
```

#### 3. Focus on the Concrete

In a learning situation, the student is in the moment with concrete things. Lead them from one concrete action and result to another.

- Use *this* problem, *this* action, *this* result
- Avoid abstraction and generalisation
- Don't discuss alternatives or options
- The general patterns will emerge naturally from concrete examples

#### 4. Deliver Visible Results Early and Often

Each step should produce a comprehensible result. This:
- Builds confidence
- Helps learners connect cause and effect
- Provides feedback that they're on track
- Maintains engagement

Even small results matter: "The file now exists", "The server is running", "Notice the colour changed".

#### 5. Maintain Narrative of Expectation

Keep providing feedback that the learner is on the right path:

- "You will notice that..."
- "After a few moments, the server responds with..."
- "The output should look something like..."
- "If you don't see..., you have probably forgotten to..."

Show exact expected output when possible. Prepare them for surprising actions: "The command will probably return several hundred lines of logs."

#### 6. Point Out What to Notice

Learning requires reflection. Learners are too focused on what they're doing to notice important signs unless prompted.

Close learning loops by pointing things out:
- "Notice how the prompt changes"
- "See that the status is now 'active'"
- "The logs show that three connections were made"

Observing is an active skill - teach it.

#### 7. Target the "Feeling of Doing"

Accomplished practitioners experience a *feeling of doing* - where purpose, action, thinking, and result flow together. This is what makes work feel like a pleasure.

Your tutorial should create conditions for this feeling:
- Tie together purpose and action
- Create smooth flow from step to step
- Allow repetition (learners will repeat successful steps for pleasure)
- Build rhythm and pace

#### 8. Ignore Options and Alternatives

There may be many ways to accomplish something. Ignore all but one. Your job is to guide the learner to a successful conclusion by the most direct path.

Different options can be explored later. Right now, stay focused on what's required to complete the lesson.

#### 9. Perfect Reliability

This is your aspiration. Every step must work, every time, for every user.

In practice, you'll discover problems only through extensive user testing. But the goal is clear: if a learner follows your directions and doesn't get the expected result, they'll lose confidence in the tutorial, the product, and themselves.

You cannot be there to rescue them when things go wrong. The tutorial must rescue itself.

### Tutorial Examples

**Good tutorial structure**:
```markdown
# Build Your First API Endpoint

In this tutorial, we'll create a simple REST API endpoint that returns user data.
By the end, you'll have a working API you can test in your browser.

## Step 1: Create the endpoint file

Create a new file called `api/users.py` with the following content:

[exact code]

Notice that we're importing the FastAPI library at the top...

## Step 2: Start the server

Run this command in your terminal:

```bash
uvicorn api.users:app --reload
```

You should see output like this:

```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

The server is now running and will automatically reload when you make changes.

## Step 3: Test your endpoint
...
```

**Bad tutorial** (too much explanation, no clear path):
```markdown
# Understanding REST APIs

REST APIs are a way to build web services. There are several approaches
you could take, including FastAPI, Flask, or Django Rest Framework. Each
has trade-offs in terms of performance and features.

To create an API, you'll need to understand HTTP methods, status codes,
and JSON serialisation...

[More explanation without clear steps]
```

---

## How-to Guides: Goal-Oriented Documentation

### What How-to Guides Are

A how-to guide addresses a real-world goal or problem by providing practical directions to help a competent user get their work done.

**Key distinction from tutorials**: How-to guides serve work, not study. They're for the already-competent user who knows what they want to achieve.

### Detailed Principles

#### 1. Address Real-World Problems

Focus on what users need to accomplish, not what the tool can do.

**Wrong approach** (tool-focused):
- "How to use the deploy command"
- "How to configure database options"

**Right approach** (problem-focused):
- "How to deploy with zero downtime"
- "How to optimise database performance for high traffic"

The guide should answer: "How do I accomplish [meaningful goal]?"

#### 2. Assume Competence

Your reader:
- Knows what they want to achieve
- Understands the domain
- Can follow directions correctly
- Will adapt your guidance to their specific situation

Don't teach basics. Don't explain concepts. If they need that, they should start with tutorials.

#### 3. Seek Flow

This is critical. Flow means the guide moves smoothly through the user's work.

Ask yourself:
- What must the user hold in their mind right now?
- When can they resolve those thoughts?
- How long are you asking them to keep concerns open?
- What will they reach for next?

Minimise context switching:
- Group operations by tool or location
- Don't make them jump back and forth between files
- Consider the pace and rhythm of their work

At its best, a how-to guide anticipates the user - it places the next tool they need right in their hand.

#### 4. Address Real-World Complexity

Real problems aren't linear. Use conditional imperatives:

- "If you need to limit requests per user, add..."
- "To handle the case where X, do Y"
- "For production deployments, also configure..."

The guide must be adaptable. You can't address every case, so find ways to remain open to possibilities while providing concrete guidance.

#### 5. Omit the Unnecessary

Practical usability beats completeness.

- Start at a reasonable point (not always from scratch)
- End at a reasonable point (not necessarily with everything configured)
- Let the user connect your guidance to their situation
- Don't list every possible option (link to reference instead)

This keeps guides crisp and focused on getting work done.

#### 6. Focus on Tasks, Not Tools

Guides are about human projects and goals. Tools are means to an end.

Sometimes a task aligns closely with one tool, and the guide will concentrate on that tool. Just as often, a real-world task cuts across multiple tools, joining them up in service of the user's goal.

The task defines what the guide covers, not the tool's capabilities.

#### 7. Provide Logical Sequence

Steps should flow in an order that makes sense for human thinking and action, not just technical requirements.

Sometimes the order is imposed by dependencies (step 2 requires step 1). But often there's subtlety: maybe two operations *could* be done in either order, but one sets up the user's environment or thinking in a way that benefits the other.

Pay attention to sense and meaning in ordering - how human beings think and act.

#### 8. Name Guides Clearly

Titles should say exactly what the guide shows.

**Good**:
- "How to integrate application performance monitoring"
- "How to configure automated backups"
- "How to troubleshoot deployment failures"

**Bad**:
- "Performance monitoring" (what about it?)
- "Backups" (too vague)
- "Deployment" (is this how-to or reference?)

Search engines appreciate good titles as much as humans do.

### How-to Guide Examples

**Good how-to guide**:
```markdown
# How to Configure Rate Limiting

This guide shows you how to add rate limiting to your API endpoints to prevent
abuse and ensure fair usage.

## Basic rate limiting per user

Add the `@rate_limit` decorator to your endpoint:

```python
@app.get("/api/data")
@rate_limit(max_requests=100, window=3600)
def get_data():
    ...
```

This limits each user to 100 requests per hour.

## Custom limits for different endpoints

If you need different limits for different endpoints, configure them separately:

[specific instructions]

## Handling rate limit errors

When a user exceeds their limit, they'll receive a 429 status code. To customise
the error response:

[specific instructions]

For a complete list of rate limiting options, see the rate limiting reference.
```

**Bad how-to guide** (teaching instead of guiding work):
```markdown
# Rate Limiting

Rate limiting is an important concept in API design. It helps protect your
servers from being overwhelmed and ensures fair resource distribution.

Let's learn about rate limiting by building a simple example. First, we need
to understand how rate limiting algorithms work...

[More explanation than action]
```

---

## Reference: Information-Oriented Documentation

### What Reference Is

Reference contains the technical description - facts - that a user needs to do things correctly. It's information you consult while working.

**Key characteristic**: Reference is neutral. It's not concerned with what the user is doing, only with accurately describing what *is*.

### Detailed Principles

#### 1. Describe and Only Describe

Neutral description is the imperative of reference.

This is harder than it seems. What's natural is to explain, instruct, discuss, opine. These all run counter to reference, which demands accuracy, precision, completeness, and clarity.

Just describe:
- What the thing is
- What it does
- How it behaves
- What options it has
- What constraints apply

Don't explain why it's designed that way (that's explanation). Don't instruct how to use it for a task (that's how-to).

#### 2. Structure Mirrors the Product

The way a map corresponds to territory helps us use it to navigate. Documentation should mirror the product structure.

If a method belongs to a class in a module:
```
docs/
  reference/
    mymodule/
      MyClass/
        my_method()
```

This helps users find what they need because the documentation structure matches their mental model of the product.

#### 3. Consistency is Paramount

Use standard patterns throughout. Reference is useful when it's consistent.

For every function, document in the same order:
1. Brief description
2. Parameters
3. Return value
4. Exceptions
5. Example (optional)

For every class:
1. Brief description
2. Constructor
3. Methods
4. Properties

Users should always find information where they expect it, in familiar formats.

#### 4. Be Austere and Authoritative

Reference should be:
- **Austere**: No decoration, no enthusiasm, no marketing
- **Authoritative**: No doubt or ambiguity
- **Factual**: Just what is true

One *consults* reference, one doesn't *read* it. It should support quick, confident lookup.

#### 5. Completeness Matters

Unlike how-to guides (which can be selective), reference should be complete.

Document:
- All parameters
- All return values
- All exceptions
- All constraints
- All warnings

Users come to reference for truth and certainty. Incomplete reference undermines confidence.

#### 6. Provide Examples

Examples illustrate without instruction or explanation.

A succinct usage example shows the function in context:

```python
# Authenticate a user
token = User.authenticate(username="alice", password="secret123")
```

This shows typical usage without falling into "how to authenticate" territory.

### Reference Examples

**Good reference**:
```markdown
# authenticate()

Authenticates a user with provided credentials and returns an authentication token.

## Parameters

- `username` (string, required): The user's username
- `password` (string, required): The user's password
- `remember` (boolean, optional): Whether to create a persistent session. Default: false
- `timeout` (integer, optional): Session timeout in seconds. Default: 3600

## Returns

`AuthToken` object containing:
- `token` (string): The authentication token
- `expires_at` (datetime): Token expiration timestamp
- `user_id` (integer): Authenticated user's ID

Returns `None` if authentication fails.

## Raises

- `InvalidCredentialsError`: When username or password is incorrect
- `AccountLockedError`: When account is locked due to failed attempts
- `DatabaseError`: When unable to access user database

## Example

```python
token = User.authenticate(
    username="alice",
    password="secret123",
    remember=True
)
```

## Notes

- Passwords are compared using constant-time comparison to prevent timing attacks
- Failed attempts are logged for security monitoring
- Maximum session timeout is 86400 seconds (24 hours)
```

**Bad reference** (instructing and explaining):
```markdown
# authenticate()

This function helps you authenticate users. You should use it when you need to
verify user credentials and create sessions.

The way it works is by checking the password hash against the stored hash in
the database. This is more secure than storing passwords in plain text.

To use it, first make sure you have a user object...

[More instruction than description]
```

---

## Explanation: Understanding-Oriented Documentation

### What Explanation Is

Explanation provides context and background. It helps users understand and see the bigger picture.

**Key characteristic**: Explanation permits reflection. It serves study (like tutorials), but through theoretical knowledge (like reference).

### Detailed Principles

#### 1. Talk *About* the Subject

Explanation approaches topics from multiple directions. It circles around the subject, providing different perspectives.

You're not documenting *for* action (like tutorials or how-to guides). You're documenting to illuminate understanding.

Even titles should reflect this: "About user authentication", "About database connection policies".

#### 2. Answer "Why"

Explanation is uniquely positioned to address "why" questions:
- Why is it designed this way?
- Why choose this over alternatives?
- Why did this evolve historically?
- Why does this constraint exist?

These questions have no place in tutorials, how-to guides, or reference. Explanation is where they belong.

#### 3. Make Connections

Help weave a web of understanding:
- Connect to related concepts
- Show how parts interact
- Link to things outside the immediate topic
- Draw parallels to familiar ideas

Understanding means seeing relationships. Explanation makes those relationships visible.

#### 4. Provide Context

Give background that helps users understand:
- Historical context: How did we get here?
- Design context: What constraints shaped this?
- Technical context: What trade-offs were made?
- Social context: How do others approach this?

Context transforms isolated facts into meaningful understanding.

#### 5. Permit Opinion and Perspective

Unlike reference (which must be neutral), explanation can and should include:
- Opinions about approaches
- Discussion of trade-offs
- Counter-examples
- Alternative perspectives

Understanding is richer than pure facts. Discussion can consider and weigh contrary opinions.

But keep it bounded - don't let opinion turn into advocacy or marketing.

#### 6. Keep Boundaries Clear

The risk with explanation is that it tends to absorb other things. You feel the urge to include instruction or reference.

But those have their own places. Keep explanation focused on understanding. If you need to instruct, link to a how-to guide. If you need technical details, link to reference.

#### 7. Take a Higher Perspective

Explanation doesn't take the user's eye-level view (like how-to guides) or the close-up view of machinery (like reference).

Its scope is a topic - "an area of knowledge" with reasonable boundaries. It looks at things from above and across, showing the bigger picture.

### Explanation Examples

**Good explanation**:
```markdown
# About Authentication Strategies

Our authentication system uses JWT tokens rather than session cookies. This decision
reflects several trade-offs in our architecture.

## Session-based vs Token-based Authentication

Session-based authentication stores state on the server. This simplifies some security
concerns - invalidating a session is just deleting a server-side record. However, it
complicates horizontal scaling. Every server needs access to session state, requiring
either sticky sessions (which limit load balancing) or a shared session store (which
becomes a single point of failure).

JWT tokens are stateless. The token itself contains all authentication information,
cryptographically signed. This makes them ideal for distributed systems - any server
can validate any token without coordinating with others.

## The Token Revocation Problem

Stateless tokens create a challenge: how do you revoke a token before it expires?
With sessions, you delete the session record. With JWTs, the token remains valid
until expiration regardless of server-side actions.

We address this through short token lifetimes (15 minutes) combined with refresh
tokens. This limits the exposure window while allowing long-lived sessions. It's a
compromise between security and user experience.

Some teams maintain a token blocklist, but this partially defeats the stateless
benefit and introduces the coordination problem we were trying to avoid.

## Historical Context

We initially used session-based authentication. As we moved to a microservices
architecture with multiple API gateways, session management became increasingly
complex. The shift to JWTs in version 2.0 was driven by these scaling requirements.

For more on implementing JWT authentication, see the authentication how-to guide.
For JWT token reference, see the security reference.
```

**Bad explanation** (too much instruction):
```markdown
# JWT Authentication

To implement JWT authentication, first install the JWT library:

```bash
pip install pyjwt
```

Then create a token like this:

[Code instructions continue...]
```

This should be in a how-to guide, not explanation.
