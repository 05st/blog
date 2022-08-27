export default function Comments({ comments = [] }) {
  return (
    <>
      <div className="pt-12">
          <h2 className="text-2xl lg:text-4xl leading-tight">
            Comments
          </h2>
          <ul>
            {comments?.map(({ _id, _createdAt, name, email, comment }) => (
              <li key={_id} className="mb-5">
                <hr className="mb-5"/>
                <h4 className="mb-2 leading-tight"><a href={`mailto:${email}`}>{name}</a> (<Date dateString={_createdAt}/></h4>
                <p>{comment}</p>
                <hr className="mt-5 mb-5"/>
              </li>
            ))}
          </ul>
        </div>
    </>
  );
}