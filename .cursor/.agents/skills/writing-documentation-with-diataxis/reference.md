# Additional Guidance and Reference

This file contains the quality framework, guidance for complex scenarios, limitations, and other reference material for applying Diataxis.

## Understanding Quality in Documentation

Documentation has two distinct kinds of quality:

### Functional Quality (Objective, Measurable)

These characteristics are independent of each other:

- **Accuracy**: Documentation matches reality
- **Completeness**: Covers everything it should
- **Consistency**: No contradictions
- **Precision**: Clear and unambiguous
- **Usefulness**: Serves actual needs

Documentation can be accurate but incomplete, or complete but inconsistent. Each is a constraint you must meet through diligence and domain knowledge.

**Diataxis cannot give you functional quality**. It requires technical skill and keeping documentation synchronised with the product.

However, Diataxis can **expose** lapses in functional quality:
- Structuring reference to mirror code makes gaps obvious
- Moving explanation out of tutorials highlights unclear steps
- Separating concerns reveals inconsistencies

### Deep Quality (Subjective, Felt)

These characteristics are interdependent - aspects of the same thing:

- Feels good to use
- Has flow
- Fits human needs
- Anticipates the user
- Feels beautiful (yes, this matters)

You can't measure these with numbers, only recognise them through use. Like clothing that moves well with your body, good documentation feels right when you use it.

Deep quality is **conditional on functional quality**. No one experiences documentation as beautiful if it's inaccurate or inconsistent. Lapses in functional quality tarnish the experience immediately.

**Diataxis addresses deep quality**. It creates conditions where flow, anticipation, and "fits my needs" become possible. It won't make your documentation accurate (that's on you), but it can make accurate documentation feel right to use.

### How They Relate

Think of it this way:
- **Functional quality** = Constraints you must conform to
- **Deep quality** = Liberation, creativity, taste

Functional quality is a burden - tests you might fail. Deep quality is the pleasure of crafting something that works well.

Diataxis helps pursue deep quality, which makes functional quality lapses more visible, which helps you improve functional quality, which then allows deep quality to shine.

## Handling Complex Scenarios

### Diataxis is an Approach, Not a Template

Diataxis isn't four boxes to fill. It's a way of thinking about documentation that identifies four needs and uses them to author and structure content effectively.

Real documentation often faces complexity that doesn't fit neatly into simple structures. That's fine. **Let documentation be as complex as it needs to be**, as long as it's logical and serves user needs.

### Multiple User Types

Your product might serve:
- End users who consume the product
- Developers who build on top of it
- Contributors who maintain it

These are effectively different products for different people. Each group has its own relationship with the product.

**Think user-first**:
- Do developers need to understand user concerns first?
  - If yes: Let developer tutorials follow user tutorials
- Do contributors need distinct workflows?
  - If yes: Completely separate their how-to guides
- Does each group need all four documentation types?
  - Maybe not - provide what each actually needs

**Don't force these into rigid structure**. Structure follows user needs, not diagram purity.

### Multiple Environments or Platforms

Deploying to AWS vs Azure vs on-premise might create vastly different workflows. Same product, different concerns.

**Options**:
- Separate documentation by environment if experiences differ significantly
- Use common structure where concerns overlap
- Let users find their path based on their situation
- Consider a routing page that directs to environment-specific docs

### Complex Hierarchies and Navigation

Real documentation gets large. Some practical guidelines:

#### Landing Pages

Landing pages should **read like overviews**, not just present lists.

Provide headings and introductory text that gives context:

```markdown
## How-to Guides

These guides help you accomplish common tasks with the platform.

### Installation Guides

Choose the installation approach that matches your environment.
Each guide takes about 15 minutes to complete.

- Local installation
- Docker deployment
- Virtual machine setup
- Linux container configuration

### Deployment and Scaling

Once installed, these guides help you deploy and scale your application
for production use.

- Deploy an instance
- Configure load balancing
- Scale your application
```

#### List Length

**Lists longer than 7 items are hard for humans to read** unless they have mechanical order (alphabetical, numerical).

If a section has 15 how-to guides, group them into categories with their own sub-landing pages:
- Installation (4 guides)
- Configuration (5 guides)
- Deployment (6 guides)

#### Structure Depth

Keep references **one level deep** from SKILL.md when possible. Don't create deeply nested structures that are hard to navigate or understand.

### When Multiple Dimensions Collide

Sometimes you have:
- Four documentation types (tutorials/how-to/reference/explanation)
- AND user types (users/developers/contributors)
- AND environments (cloud/on-premise/hybrid)

Which dimension comes first in hierarchy?

**There's no single answer**. Think about:
- How do your users think about the product?
- Does a cloud user also need on-premise docs?
- Does a developer typically need all four doc types for their domain?
- What's the most common path users take?

Structure to serve users, not to satisfy a diagram.

## What Diataxis Cannot Do

Be clear about the limits:

### It Won't Make Your Documentation Accurate

Accuracy requires domain knowledge and keeping docs synchronised with reality. Diataxis can help expose gaps, but can't fill them.

You need to:
- Understand the product deeply
- Test every claim
- Update docs when the product changes
- Verify technical details

### It Won't Guarantee Deep Quality

Diataxis creates conditions where flow and anticipation become possible, but it's not a formula.

You still need:
- Taste and judgement
- Understanding of user experience
- Empathy for your users
- Writing skill

### It Can't Bypass Other Expertise

Other disciplines matter:
- UX design
- Visual design
- Information architecture
- Technical writing
- Domain expertise

Diataxis complements these, doesn't replace them.

### It's Not a Shortcut

Good documentation requires:
- Skill
- Time
- Iteration
- User testing
- Ongoing maintenance

Diataxis provides direction and principles, not magic.

### It Won't Solve Every Documentation Problem

Some problems are about:
- Resources and staffing
- Organisational politics
- Product complexity
- Rapidly changing systems
- Technical debt

Diataxis helps with form and structure, not everything else.

**Think of Diataxis as laying foundations**. Strong foundations create the possibility of excellent documentation, but you still have to build the house.

## The User's Journey

Users move through a cycle with your product:

1. **Learning phase** - Diving in to do things under guidance (tutorials)
2. **Goal phase** - Putting skills to work on real problems (how-to guides)
3. **Information phase** - Consulting facts while working (reference)
4. **Understanding phase** - Stepping back to reflect and deepen knowledge (explanation)

This isn't strictly linear. A user might:
- Jump to reference while following a tutorial
- Return to tutorials when learning new features
- Start with explanation to get oriented
- Skip tutorials entirely if already competent

But there's a natural progression as someone moves from newcomer to expert. Documentation should serve users wherever they are in this cycle.

## The Iterative Philosophy

### Start Small

Don't try to understand everything about Diataxis before using it. Pick up one idea that seems useful and apply it right now. Understanding comes through practice.

### Organic Growth

Think of documentation like a plant:
- A plant is never finished, but always complete at its current stage
- It grows from the inside out, cell by cell
- Structure emerges naturally from healthy development
- It adapts to external conditions

Your documentation should be the same:
- Always complete for its current state
- Always ready to grow further
- Structure emerges from well-formed content
- Adapts to changing user needs

### The Basic Workflow

1. **Choose something** - Any piece, even at random
2. **Assess it** - Challenge it with Diataxis questions
3. **Decide on one action** - What single improvement helps now?
4. **Do it** - Complete that action, commit it
5. **Repeat** - Go back to step 1

This keeps work flowing without requiring a big plan. Each small change moves in the right direction. Structure forms itself.

## Common Boundary Problems

### Tutorial/How-to Confusion

This is the **most common mistake**. The distinction matters because:

**Tutorials** (at study):
- For learners building competence
- Carefully managed path
- Eliminates the unexpected
- No choices or alternatives
- Concrete and specific
- Teacher takes responsibility
- Can be basic or advanced

**How-to Guides** (at work):
- For competent users solving problems
- Adapts to real-world complexity
- Prepares for the unexpected
- Offers conditional guidance
- General and adaptable
- User has responsibility
- Can be basic or advanced

The difference isn't basic vs advanced. It's study vs work, learning vs applying.

**Medical analogy**: A medical school lesson on suturing (tutorial) vs a surgical manual for appendectomy (how-to). Both are professional-level, but one teaches skills, the other guides application of skills.

### Reference/Explanation Blur

**Reference** (work):
- Describes what is
- Boring and unmemorable
- Lists and tables
- You consult it while working
- Neutral facts only

**Explanation** (study):
- Discusses why and how
- You might read it away from work
- Can be read "in the bath"
- Context and connections
- Can include opinion

**The test**: Is this something someone would turn to while working (reference) or while reflecting away from work (explanation)?

## Additional Patterns

### Documentation for Different Maturity Levels

You might have:
- Getting started tutorial (beginners)
- Advanced integration tutorial (experienced developers)
- Basic how-to guides (common tasks)
- Advanced how-to guides (complex scenarios)

This is fine. The tutorial/how-to distinction is about study vs work, not basic vs advanced.

### Living Documentation

Documentation that:
- Changes frequently with the product
- Has many contributors
- Serves rapidly evolving needs

**Diataxis helps here** by:
- Providing clear categories for contributions
- Making it obvious where new content belongs
- Preventing muddle that accumulates over time

### Minimalist Documentation

You don't need all four types for every feature. Sometimes you only need:
- Reference (for simple, well-understood tools)
- How-to guide + reference (for established practices)
- Tutorial + reference (for new or complex features)

Provide what users actually need, not what feels complete.

## Practical Tips

### When Writing

**For tutorials**:
- Test with real users repeatedly
- Watch where they get stuck
- Fix every point of failure
- Aim for perfect reliability

**For how-to guides**:
- Talk to users about their goals
- Identify real problems they face
- Focus on flow and anticipation
- Don't try to be exhaustive

**For reference**:
- Mirror the product structure exactly
- Use automated generation where possible
- Keep it synchronised with code
- Be consistent above all

**For explanation**:
- Write when you have time to think
- Take multiple perspectives
- Connect to other knowledge
- Don't rush it

### When Reviewing

Look for these signs:

**Boundary violations**:
- Explanation in tutorials (extract and link)
- Instruction in reference (move to how-to)
- Teaching in how-to guides (assume competence)
- Reference detail in tutorials (link instead)

**Missing flow**:
- Excessive context switching
- Concerns left unresolved
- Unexpected jumps
- Disrupted rhythm

**Wrong audience**:
- Tutorial assuming competence
- How-to guide teaching basics
- Reference assuming intent
- Explanation instructing

### When Stuck

1. Use the compass
2. Read principles for that type
3. Look at examples
4. Ask: What does the user need right now?
5. Serve that need directly

When in doubt, make it simpler and more focused.
