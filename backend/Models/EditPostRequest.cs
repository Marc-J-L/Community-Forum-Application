public class EditPostRequest
{
    public required string Title { get; set; }
    public required string Text { get; set; }
    public string[]? Images { get; set; }
    public required string Visibility { get; set; }
}
